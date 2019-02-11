if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const Person = require("./models/person");

app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());
morgan.token("json", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then(result => {
    res.send(
      `<p>Puhelinluettelossa ${
        result.length
      } henkilön tiedot</p><p>${new Date()}</p>`
    );
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const modPerson = req.body;
  const person = {
    name: modPerson.name,
    number: modPerson.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const newPerson = req.body;

  if (newPerson.name === undefined || newPerson.number === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON());
    })
    .catch(error => {
      res.status(404).end();
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

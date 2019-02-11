const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors')

const app = express();

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json());
morgan.token("json", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :json"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-21423123"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-4323234"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-784232"
  }
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Puhelinluettelossa ${
      persons.length
    } henkilön tiedot</p><p>${new Date()}</p>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;
  newPerson.id = Math.floor(Math.random() * 10000);

  if (newPerson.name === undefined || newPerson.number === undefined) {
    return res.status(400).json({ error: "content missing" });
  }
  if (
    persons.find(
      person => person.name.toLowerCase() === newPerson.name.toLowerCase()
    )
  ) {
    return res.status(400).json({ error: "name must be unique" });
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

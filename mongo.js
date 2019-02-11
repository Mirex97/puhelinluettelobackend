const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

console.log(process.argv);

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0-1mijw.mongodb.net/test?retryWrites=true`;

mongoose.connect(url, { useNewUrlParser: true });
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);
if (process.argv.length < 4) {
  console.log("puhelinluettelo:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(response => {
    console.log(`lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`);
    mongoose.connection.close();
  });
}

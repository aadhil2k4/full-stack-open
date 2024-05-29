const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('Provide password as argument')
    process.exit(1)
}
else if(process.argv.length === 4){
    console.log('give number as argument')
}
else if(process.argv.length === 5){
    const person = new Person({
        name: `${name}`,
        number: `${number}`,
      })
      
      person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
}
else if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`Name: ${person.name} Number: ${person.number}`);
        });
        mongoose.connection.close();
    });
} 





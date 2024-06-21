require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const PORT = process.env.PORT;
const url = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

console.log('connecting to ', url);

mongoose.connect(url)
.then(result=>{
    console.log('connected to MongoDB');
})
.catch(error=>{
    console.log('error connecting to MongoDB: ', error.message);
})

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})
  
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Blog', blogSchema)
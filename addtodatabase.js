const mongoose = require('mongoose');
const { find } = require('./models/blogData');
const url = 'mongodb://localhost:27017/bloglist-dev-test';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

const newObj = [
    {
        title: 'adding from a seperate file',
        author: 'hanan',
    },
    {
        title: 'adding from a seperate file',
        author: 'bartick',
    }
]
// blogSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//     }
//   })
  
const BlogModel = mongoose.model('blog', blogSchema);
const addToDataB = new BlogModel(newObj[1]);

addToDataB.save();
// let delFunc = async () => {
//     //await BlogModel.deleteMany({}) // a
//     await addToDataB.save(); // b
//     // BlogModel.find({}).then(blog => {
//     //         console.log(JSON.stringify(blog))
//     //     })
// };

// await delFunc(); // c



// a -> b -> -> c -> d

// addToDataB.save();
// BlogModel.find({}).then(blog => {
//     console.log(JSON.stringify(blog))
// })
console.log('hello') //d
// afterAll(() => {
//     mongoose.connection.close();
//   })
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const config = require('../utils/config');

const url = config.MONGODB_URI;
logger.info('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    logger.info('connected to MongoDddddB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

// these next steps is for removing the ._v id from printing to the frontend
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('blog', blogSchema)

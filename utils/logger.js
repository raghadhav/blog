const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.log(...params)
      }
//console.log(...params)
//console.log('from the utils')
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.error(...params)
      }
}

module.exports = {
    info, error
}
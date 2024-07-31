'use strict'

const mongoose = require('mongoose')

const connectionString = `mongodb+srv://thaonguyengdw:19N1I4EDlCElK6Nf@cluster0.aaaww90.mongodb.net/`

mongoose.connect(connectionString).then( _ => console.log(`Connected Mongodb Success`))
.catch( err => console.log(`Error Connect!`))

//dev
if(1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose
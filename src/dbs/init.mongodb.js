'use strict'
const mongoose = require('mongoose')

const { db: { host, name, port }} = require('../configs/config.mongodb')
// const connectionString = `mongodb+srv://thaonguyengdw:19N1I4EDlCElK6Nf@cluster0.aaaww90.mongodb.net/`
const connectionString = `mongodb://${host}:${port}/${name}`

const { countConnect } = require('../helpers/check.connect')

console.log(`connectionString:`, connectionString)
class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb'){
        mongoose.connect(connectionString, {
            maxPoolSize: 50
        }).then( _ => {
            console.log(`Connected Mongodb Success`, countConnect())
        })
        .catch( err => console.log(`Error Connect!`))
        
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
    }

    static getInstance() {
        if(!Database.instance){
             Database.instance = new Database()

        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
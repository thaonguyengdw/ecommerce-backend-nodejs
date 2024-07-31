'use strict'
// require('dotenv').config()  
const { Client, GatewayIntentBits } = require('discord.js')
const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env

class LoggerService {
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds, // cap quyen
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        //add channelId
        this.channelId = CHANNELID_DISCORD,
        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}!`)
        })
        this.client.login(TOKEN_DISCORD)
    }

    sendToMessage( message = 'message'){
        const channel = this.client.channels.cache.get(this.channelId)
        if(!channel){
            console.error(`Couldn't find the channel...`, this.channelId)
            return;
        }

        channel.send(message).cache(e => console.error(e))
    }
}

// const loggerService = new LoggerService();

module.exports = new LoggerService()//loggerService()
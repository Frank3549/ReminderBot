require('dotenv').config();
const {Client, IntentsBitField}  = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]

});

client.on('ready', (c) => {
    console.log(`The ${c.user.tag} is online.`)
});

client.on('messageCreate', (message) => {
    if(!message.author.bot){
        return
    }

});

client.login(process.env.TOKEN);
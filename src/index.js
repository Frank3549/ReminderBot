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
    if(message.author.bot){
        return;
    }
    if(message.content){
        console.log(message);
    }
    reactIfWord(message, process.env.WORD1, process.env.EMOJI1);
    
    

});

client.login(process.env.TOKEN);

const reactIfWord = (message, wordToReactOn, reactEmoji) => {
    if ((message.content.toLowerCase()).includes(wordToReactOn)){
        const emojiToSend = client.emojis.cache.find(emoji => emoji.name === reactEmoji); 
        message.react(emojiToSend);
    }
}
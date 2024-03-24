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
    reactIfWord(message, process.env.WORD1, process.env.EMOJI1, true, process.env.TIMER1);
    reactIfWord(message, process.env.WORD2, process.env.EMOJI1, true, process.env.TIMER1);

    
});

client.login(process.env.TOKEN);


/*
    React to a message if it includes a trigger word (not case sensitive).

    message - Discord given message object
    wordToReactOn - A string that will trigger the reaction Emoji.
    reactEmoji - A string of the reaction Emoji name. Exclude the colons in the name.
    temporaryReact - Boolean if the reaction is temporary.
    secondsToRemove - If temporary, how many seconds should it stay up? (decimals are accepted)
*/

const reactIfWord = (message, wordToReactOn, reactEmoji, temporaryReact, secondsToRemove) => {
    if ((message.content.toLowerCase()).includes(wordToReactOn)){
        const emojiToSend = client.emojis.cache.find(emoji => emoji.name === reactEmoji); 
        
        if(temporaryReact){
            message.react(emojiToSend)
            .then(reaction => {
                timeToRemoveReaction(reaction, secondsToRemove * 1000); // convert to milliseconds
            })
            .catch(error => console.log(`Couldn't remove the reaction Error: ${error}`))
        }
        else{
            message.react(emojiToSend);
        }
    }
}

const timeToRemoveReaction = (reaction, secondsToRemove) => {
    setTimeout(() => (reaction.remove()), secondsToRemove)
}
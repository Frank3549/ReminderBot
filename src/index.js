require('dotenv').config();
const {Client, IntentsBitField}  = require('discord.js');

// Example in storedTriggerWordsExample.json
const reactionSpecification = require("./storedTriggerWords.json");

const TIMERSECONDS = 0.75;


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

    triggerWords(message, reactionSpecification);

    
});

client.login(process.env.TOKEN);


/*
    Take in a message and apply applicable reaction "rules".

    Parameters:
    messageObject - The "message" object given by discord api
    reactionSpecification - an array of objects that contain the following:
        wordToReactOn - A string that will trigger the reaction Emoji.
        reactEmoji - A string of the reaction Emoji name. Exclude the colons in the name.
        temporaryReact - Boolean if the reaction is temporary.
*/

function triggerWords(messageObject, reactionSpecifications) {
    // not efficient. Could use a set, but that would increase complexity of reactionSpecifications.
    reactionSpecifications.forEach(obj => {
        reactIfWord(messageObject, obj.wordToReactOn, obj.reactEmoji, obj.temporaryReact);
    });
}

/*
    Purpose: React to a message if it includes a trigger word (not case sensitive).

    message - Discord given message object
    wordToReactOn - A string that will trigger the reaction Emoji.
    reactEmoji - A string of the reaction Emoji name. Exclude the colons in the name.
    temporaryReact - Boolean if the reaction is temporary.
*/

const reactIfWord = (message, wordToReactOn, reactEmoji, temporaryReact) => {
    if ((message.content.toLowerCase()).includes(wordToReactOn)){
        const emojiToSend = client.emojis.cache.find(emoji => emoji.name === reactEmoji); 
        
        if(temporaryReact){
            message.react(emojiToSend)
            .then(reaction => {
                setTimeout(() => (reaction.remove()), TIMERSECONDS * 1000) // convert to milliseconds 
            })
            .catch(error => console.log(`Couldn't remove the reaction Error: ${error}`))
        }
        else{
            message.react(emojiToSend);
        }
    }
}

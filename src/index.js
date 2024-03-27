require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, IntentsBitField, Collection, Events } = require('discord.js');

// Example in storedTriggerWordsExample.json
const reactionSpecification = require('./storedTriggerWords.json');
const TIMERSECONDS = 0.75;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],

});

client.on('ready', (c) => {
	console.log(`The ${c.user.tag} is online.`);
});

client.commands = new Collection();


// Find command folders and instructions inside them for slash commands.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) {
        return;
    }

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

});

client.on('messageCreate', (message) => {
	if (message.author.bot) {
		return;
	}
	if (message.content) {
		console.log(message);
	}

	triggerWords(message, reactionSpecification);


});


// Replace with your own token
client.login(process.env.TOKEN);

// FUNCTIONS //

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
	if ((message.content.toLowerCase()).includes(wordToReactOn)) {
		const emojiToSend = client.emojis.cache.find(emoji => emoji.name === reactEmoji);

		if (temporaryReact) {
			message.react(emojiToSend)
				.then(reaction => {
					setTimeout(() => (reaction.remove()), TIMERSECONDS * 1000);
				})
				.catch(error => console.log(`Couldn't remove the reaction Error: ${error}`));
		}
		else {
			message.react(emojiToSend);
		}
	}
};

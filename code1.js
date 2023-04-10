const {Client, Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const ytdl = require('ytdl-core');
const fs = require('fs');
const token = 'OTY4MTM3NjUwNzE4NTMxNjQ0.G7XbHa.Z6H-tc341KugEoFcUDPnLr6EmvWEWjl-0k4xhA';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once('ready', async () => {
    
    const commands = [
        {
            name: 'play',
            description: 'Play a song',
            options: [
                {
                    name: 'song',
                    type: 'STRING',
                    description: 'The name or URL of the song to play',
                    required: true
                }
            ]
        }
    ];

    const guildId = "933996450969444382"

    await client.guilds.cache.get(guildId)?.commands.set(commands);

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'play') {
            const query = args.find(arg => arg.name.toLowerCase() === 'song').value;
            const url = await getUrl(query);

            if (!url) {
                return interaction.reply({ content: 'Unable to find video!', ephemeral: true });
            }

            const connection = await interaction.member.voice.channel.join();
            const stream = ytdl(url, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('finish', () => {
                connection.disconnect();
            })

            interaction.reply(`Playing ${url}`);
        }
    })
})

async function getUrl(query) {
    try {
        const video = await pafy.getInfo(query);
        return video.bestaudio.url;
    } catch (error) {
        console.error(error);
        return null;
    }
}

client.login(token);

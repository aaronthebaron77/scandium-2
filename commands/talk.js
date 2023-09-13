const Discord = require("discord.js"); 
const https = require('https');

module.exports.name = "talk";

async function fetchmessages(channel, limit = 20) {
    const sum_messages = [];
    let last_id;

    while (true) {
	const options = { limit: 20 };
	if (last_id) {
	    options.before = last_id;
	}

	const messages = await channel.messages.fetch(options);
	sum_messages.push(...messages.array());
	last_id = messages.last().id;

	if (messages.size != 100 || sum_messages >= limit) {
	    break;
	}
    }

    return sum_messages;
}

module.exports.run = async (bot,message,args) => {
	if (args.length < 1) {
		const exampleEmbed2 = new Discord.MessageEmbed()
		.setColor('#ff0000')
		.setTitle(`Invalid command structure.`);
		return await message.channel.send(exampleEmbed2);
	}
   	// import { gpt } from "gpti";
	var msgs = await fetchmessages(message.channel);
	var context = `

The following is a conversation between several users and an anime girl named Scandium in an online group chat. Scandium is a white-haired 16 year old girl who likes art and video games like Terraria and Rhythm games like Muse Dash and Osu. Scandium is rather shy and demure.\n`;
	
	for(m of msgs) {
		if (m.id === message.id) continue;
		const member = (await m.guild).members.cache.find(member => member.id === m.author.id);
		var c = (m.content.startswith("<>talk")) ? m.content.replace("<>talk", '') : m.content;
		context += "This is a past message: \n";
		context += (m.author.username + ": " + c + '\n');
	}

	Context += "This is the current message to Scandium: \n";
	context += (message.author.username + ": " + args.join(" ")) + "\n";

	const mb = (await message.guild).members.cache.find(member => member.id === message.author.id);
	context += `Respond to ${message.author.username} as if you were Scandium.`;
	console.log(context);
	
	const { gpt } = require("gpti");
	
	gpt({
	    prompt: context,
	    model: 6,                         // code or model
	    type: "json"                            // optional: "json" or "markdown"
	}, (err, data) => {
	    if(err != null){
	        console.log(err);
	    } else {
	        console.log(data);
		message.channel.send(data.gpt);
	    }
	});
}

module.exports.help = {

    name:"talk",
    desc: "head",
    personalThoughts: "pat"

}

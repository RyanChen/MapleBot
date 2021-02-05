const Discord = require('discord.js');
const {prefix, version} = require('./config.json');
const commands = require('./commands.json');

const BotInfoMsgEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('MapleBot Information')
	// .setURL('https://discord.js.org/')
	.setAuthor('RyanChen', 'https://i.imgur.com/GMIaI2q.png')
	.setDescription('MapleBot for guild named 『伏時夢長』')
	.setThumbnail('https://i.imgur.com/irYgCg7.png')
	.addFields(
		{ name: 'Bot Version', value: version, inline: true },
        { name: 'Bot Author', value: 'RyanChen', inline: true },
	)
	.setImage('https://i.imgur.com/eJTi3bj.png')
	.setTimestamp()
    .setFooter('Copyright © 2020 RyanChen All rights reserved.', 'https://i.imgur.com/GMIaI2q.png');
    
const ManagersMsgEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('管理者資訊')
    .setDescription('公會會長以及副會長資訊列表')
    .setThumbnail('https://i.imgur.com/irYgCg7.png')
    .addFields(
		{ name: '會長', value: '綠綠安m' },
        { name: '副會長', value: 'Ryan迪迪\n折花無痕\n水裡的魚小冷\nHeyYeah黑夜c\n薏仁0e\nFF鼻樑終結者\n急凍小美'},
    )

try {
    command = new Array()
    for(var k in commands) {
        let EFData = {name: `${prefix}` + k, value: commands[k]};
        command.push(EFData)
    }
} catch (error) {
    console.log(error)
}

const CommandsMsgEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Commands')
    .setDescription('All commands of this bot are list below:')
    .addFields(command)

function SetAlarmStatus(status) {
    alarm_status = status;
    console.log("alarm_status = " + alarm_status)
}

module.exports =  {
    BotInfoMsgEmbed: BotInfoMsgEmbed,
    ManagersMsgEmbed: ManagersMsgEmbed,
    CommandsMsgEmbed: CommandsMsgEmbed
};

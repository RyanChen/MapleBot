const Discord = require('discord.js');
const {prefix, version} = require('./config.json');
const commands = require('./commands.json');

const BotInfoMsgEmbed = new Discord.MessageEmbed()
	.setColor('#ff0000')
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
    .setColor('#ff00ff')
    .setTitle('管理者資訊')
    .setDescription('公會會長以及副會長資訊列表')
    .setThumbnail('https://i.imgur.com/irYgCg7.png')
    .addFields(
		{ name: '會長', value: '綠綠安m' },
        { name: '副會長', value: 'Ryan迪迪\n折花無痕\n水裡的魚小冷\nHeyYeah黑夜c\n薏仁0e\nFF鼻樑終結者\n急凍小美'},
    )

let set_list_serial_msg = (serial_data) => {
    return new Promise((resolve, reject) => {
        ListSerialMsgEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addFields(
            { name: 'Serial Information', value: serial_data, inline: true }
        )
        .setTimestamp()
        .setFooter('Copyright © 2021 RyanChen All rights reserved.', 'https://i.imgur.com/GMIaI2q.png');
        resolve(ListSerialMsgEmbed)
    }).catch(error => { console.log(error); reject(false); });
};

let set_single_serial_msg = (serial_data) => {
    return new Promise((resolve, reject) => {
        SingleSerialMsgEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addFields(
            { name: '名稱', value: serial_data.rows[0].name, inline: true },
            { name: '序號', value: serial_data.rows[0].serial_number, inline: true },
            { name: '使用期限', value: serial_data.rows[0].due_date == null ? "-" : serial_data.rows[0].due_date, inline: true },
        )
        .setTimestamp()
        .setFooter('Copyright © 2021 RyanChen All rights reserved.', 'https://i.imgur.com/GMIaI2q.png');
        resolve(SingleSerialMsgEmbed)
    }).catch(error => { console.log(error); reject(false); });
};

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
    .setColor('#00ff00')
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

module.exports.set_list_serial_msg = function (serial_data) {
    return set_list_serial_msg(serial_data)
};

module.exports.set_single_serial_msg = function (serial_data) {
    return set_single_serial_msg(serial_data)
};
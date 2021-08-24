const Discord = require('discord.js');
const {prefix, version} = require('./config.json');
const commands = require('./commands.json');

const BotInfoMsgEmbed = new Discord.MessageEmbed()
	.setColor('#ff0000')
	.setTitle('MapleBot Information')
	// .setURL('https://discord.js.org/')
	.setAuthor('RyanChen', 'https://i.imgur.com/GMIaI2q.png')
	.setDescription('MapleBot for guild named 『伏時夢長』')
	.setThumbnail('https://i.imgur.com/ZimIpbD.png')
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
    .setThumbnail('https://i.imgur.com/ZimIpbD.png')
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

let set_server_status_msg = (server_status_data) => {
    try {
        latency_msg = new Array()
        others_latency_info = ""
        column = 3 // Setting column number

        for(k in server_status_data) {
            if (k == "Channel")
            {
                var str_name_row_0 = "Channel"
                var str_name_row_1 = "\u200b"
                var str_name_row_2 = "\u200b"

                var str_value_row_0 = ""
                var str_value_row_1 = ""
                var str_value_row_2 = ""

                max_latency_channel = {"Name": "None", "Latency": -999}
                min_latency_channel = {"Name": "None", "Latency": 999}

                data_count = server_status_data[k].length
                for (var i = 0; i < data_count; i++)
                {
                    Name = latency_data[k][i]["Name"]
                    Latency = latency_data[k][i]["Latency"]

                    if (Latency > max_latency_channel["Latency"])
                    {
                        max_latency_channel["Name"] = Name
                        max_latency_channel["Latency"] = Latency
                    }

                    if (Latency < min_latency_channel["Latency"])
                    {
                        min_latency_channel["Name"] = Name
                        min_latency_channel["Latency"] = Latency
                    }

                    if ((i % column) == 0)
                    {
                        if (str_value_row_0 == "")
                        {
                            str_value_row_0 = "**" + Name + "**" + "：" + Latency + " ms"
                        }
                        else
                        {
                            str_value_row_0 = str_value_row_0 + "\n" + "**" + Name + "**" + "：" + Latency + " ms"
                        }
                    }
                    else if (i % column == 1)
                    {
                        if (str_value_row_1 == "")
                        {
                            str_value_row_1 = "**" + Name + "**" + "：" + Latency + " ms"
                        }
                        else
                        {
                            str_value_row_1 = str_value_row_1 + "\n" + "**" + Name + "**" + "：" + Latency + " ms"
                        }
                    }
                    else if (i % column == 2)
                    {
                        if (str_value_row_2 == "")
                        {
                            str_value_row_2 = "**" + Name + "**" + "：" + Latency + " ms"
                        }
                        else
                        {
                            str_value_row_2 = str_value_row_2 + "\n" + "**" + Name + "**" + "：" + Latency + " ms"
                        }
                    }


                }

                latency_msg.push({name: str_name_row_0, value: str_value_row_0, inline: true})
                latency_msg.push({name: str_name_row_1, value: str_value_row_1, inline: true})
                latency_msg.push({name: str_name_row_2, value: str_value_row_2, inline: true})
                console.log(latency_msg)
            }
            else if (k == "Mall" || k == "Market" || k == "Instanced")
            {
                data_count = server_status_data[k].length
                for (var i = 0; i < data_count; i++)
                {
                    Name = latency_data[k][i]["Name"]
                    Latency = latency_data[k][i]["Latency"]
                    if (others_latency_info == "")
                    {
                        others_latency_info = "**" + Name + "**" + "：" + Latency + " ms"
                    }
                    else
                    {
                        others_latency_info = others_latency_info + " " + "**" + Name + "**" + "：" + Latency + " ms"
                    }
                }
            }
        }

        if (others_latency_info == "")
        {
            others_latency_info = "**建議** " + min_latency_channel["Name"] + "：" + min_latency_channel["Latency"] + " ms" + " **避開** " + max_latency_channel["Name"] + "：" + max_latency_channel["Latency"] + " ms"
        }
        else
        {
            others_latency_info = others_latency_info + "\n" + "**建議** " + min_latency_channel["Name"] + "：" + min_latency_channel["Latency"] + " ms" + " **避開** " + max_latency_channel["Name"] + "：" + max_latency_channel["Latency"] + " ms"
        }
    } catch (error) {
        console.log(error)
    }

    return new Promise((resolve, reject) => {
        ServerStatusMsgEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Server Latency Status')
        .setDescription(others_latency_info)
        .setThumbnail('https://i.imgur.com/xabVrds.png')
        .addFields(latency_msg)
        .setTimestamp()
        .setFooter('Copyright © 2021 RyanChen All rights reserved.', 'https://i.imgur.com/GMIaI2q.png');
        resolve(ServerStatusMsgEmbed)
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
    .setFooter('Copyright © 2020 RyanChen All rights reserved.', 'https://i.imgur.com/GMIaI2q.png');

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

module.exports.set_server_status_msg = function (server_status_data) {
    return set_server_status_msg(server_status_data)
};
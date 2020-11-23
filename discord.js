const Discord = require('discord.js');
const {prefix, version} = require('./configs/config.json');
const commands = require('./configs/commands.json');
const calendar = require('./modules/calendar.js');
const schedule = require('node-schedule');
const google_auth = require('./modules/google_auth.js');
/***
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ |
│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
***/

const token = process.env.TOKEN
const channel_id = process.env.CHANNEL_ID
const client = new Discord.Client();

client.login(token).then(loggin => {
    // Yay, it worked!
    console.log("Logging Successfully.");
}).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
});

var channel;

// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    channel = client.channels.cache.get(channel_id)
    var msg = "MapleBot is online!";
    send_msg_to_channel(msg);
    google_auth.authorize().then((res) => { 
        if (res) {
            ScanCalendar('hour');
        }
     })
});

function ScanCalendar(freq) {
    rule = SetRule(freq)
    let job = schedule.scheduleJob(rule, () => {
        GetEventMessage().then((res, err) => {
            if (res != "") {
                send_msg_to_channel(res, true);
            }
        })
    });
}

function GetEventMessage(){
    var EventMessage = ""
    return new Promise((resolve, reject) => {
        calendar.get_event().then((res) => {
            if (res.length) {
                res.map((event, i) => {
                    if (EventMessage != "")
                    {
                        EventMessage += "\n";
                    }

                    EventMessage += "『" + event.summary + "』" + " " + event.description;
                });
            }

            resolve(EventMessage);
        })
    }).catch(error => { return EventMessage; });
}

function SetRule(freq) {
    // second、minute、hour、date、dayOfWeek、month
    let rule = new schedule.RecurrenceRule();
    if (freq == 'month') {
        to_run = Array.from(Array(12).keys(0), x => x + 1); // 1-12
        rule.month = to_run;
        rule.date = 1;
        rule.hour = 0;
        rule.minute = 0;
    }
    else if (freq == 'dayOfWeek') {
        to_run = Array.from(Array(8).keys(0)); // 0-7
        rule.dayOfWeek = to_run;
        rule.hour = 0;
        rule.minute = 0;
    }
    else if (freq == 'date') {
        to_run = Array.from(Array(31).keys(0), x => x + 1); // 1-31
        rule.date = to_run;
        rule.hour = 0;
        rule.minute = 0;
    }
    else if (freq == 'hour') {
        console.log("Rule = hour")
        to_run = Array.from(Array(24).keys(0)); // 0-23
        rule.hour = to_run;
        rule.minute = 0;
    }
    else if (freq == 'minute') {
        to_run = Array.from(Array(59).keys(0)); // 0-59
        rule.minute = to_run;
    }
    else if (freq == 'second') {
        to_run = Array.from(Array(59).keys(0));// 0-59
        rule.second = to_run;
    }
    else {
        console.log("Rule default is minute")
        to_run = Array.from(Array(59).keys(0));
        rule.minute = to_run;
    }

    return rule;
}

function send_msg_to_channel(msg, is_everyone=false) {
    if (is_everyone) {
        channel.send("@everyone" + " " + msg);
    }
    else {
        channel.send(msg);
    }
}

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
    if (msg.content === `${prefix}author`) {
        msg.reply('The author of this bot is RyanChen.');
    }
    else if (msg.content === `${prefix}event`) {
        GetEventMessage().then((res, err) => {
            if (res != "") {
                msg.reply(res);
            }
            else {
                msg.reply("There is no event in this hour.");
            }
        })
    }
    else if (msg.content === `${prefix}help`) {
        var m = "Commands:" + "\n";
        for(var k in commands) {
            m += `${prefix}` + k + " : " + commands[k] + "\n"
        }
        msg.reply(m);
    }
    else if (msg.content === `${prefix}version`) {
        msg.reply(`The current version of bot is ${version}.`);
    }
    else {
        if (msg.content.startsWith(`${prefix}`)) {
            msg.reply('Command not found. Please use ">>help" for detail.');
        }
    }
});

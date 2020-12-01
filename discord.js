const Discord = require('discord.js');
const {prefix} = require('./configs/config.json');
const calendar = require('./modules/calendar.js');
const schedule = require('node-schedule');
const google_auth = require('./modules/google_auth.js');
const EmbedMessages = require('./configs/message.js');
const roleClaim = require('./modules/role-claim')

const token = process.env.TOKEN
const channel_id = process.env.CHANNEL_ID
const client = new Discord.Client();

client.login(token).then(loggin => {
    console.log("Logging Successfully.");
}).catch(e => {
    console.error(e);
});

var channel;

// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    roleClaim(client);
    channel = client.channels.cache.get(channel_id)
    // var msg = "MapleBot is online!";
    // send_msg_to_channel(msg);

    CleanMessageJob();

    google_auth.authorize('token').then((res) => {
        if (res) {
            ScanCalendar(5);
            alarm_status = true;
        }
    })
});

var job;
var alarm_status = false;
var to_everyone = false;
var to_here = false;
var to_notify_group_only = true

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

function ScanCalendar(freq=5) {
    // rule = SetRule(freq)
    // job = schedule.scheduleJob(rule, () => {
    //     GetEventMessage().then((res, err) => {
    //         if (res != "") {
    //             send_msg_to_channel(res, true);
    //         }
    //     }).catch(error => { return; });
    // })
    var rule_string = `0 */${freq} * * * *`;
    job = schedule.scheduleJob(rule_string, function(){
        GetEventMessage().then((res, err) => {
            if (res != "") {
                send_msg_to_channel(res, to_everyone, to_here, to_notify_group_only);
            }
        }).catch(error => { return; });
    });
}

function CleanMessageJob() {
    var rule_string = `0 0 0 * * *`;
    job = schedule.scheduleJob(rule_string, function(){
        clean_all_message_in_channel();
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

function send_msg_to_channel(msg, is_everyone=false, is_here=false, is_to_notify_group_only=false) {
    if (is_everyone) {
        channel.send("@everyone" + " " + msg);
    }
    else if (is_here) {
        channel.send("@here" + " " + msg);
    }
    else if(is_to_notify_group_only) {
        channel.send("<@783275715507650581>" + " " + msg);
    }
    else {
        channel.send(msg);
    }
}

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
    if (msg.content.toLowerCase().startsWith(`${prefix}alarm`)) {
        var parameters = msg.content.split(' ');
        if (parameters.length > 1) {
            var para_1 = parameters[1];
            if (para_1 == "on") {
                google_auth.authorize('token').then((res) => {
                    if (res) {
                        ScanCalendar(5);
                        alarm_status = true;
                        msg.reply("Alarm start.");
                    }
                })
            }
            else if (para_1 == "off") {
                job.cancel();
                alarm_status = false;
                msg.reply("Alarm is stop.");
            }
            else if (para_1 == "status") {
                msg.reply("Alarm status: " + alarm_status);
            }
            else
            {
                msg.reply('Parameter error. Please use ">>help" for detail.');
            }
        }
        else
        {
            msg.reply('Parameter error. Please use ">>help" for detail.');
        }
    }
    else if (msg.content.toLowerCase() === `${prefix}clean`) {
        clean_all_message_in_channel();
    }
    else if (msg.content.toLowerCase() === `${prefix}50`)
    {
        for (var i = 1 ; i < 50 ; i++)
        {
            channel.send(i);
        }
    }
    else if (msg.content.toLowerCase() === `${prefix}event`) {
        GetEventMessage().then((res, err) => {
            if (res != "") {
                msg.reply(res);
            }
            else {
                msg.reply("There is no event in this hour.");
            }
        })
    }
    else if (msg.content.toLowerCase() === `${prefix}help`) {
        msg.reply(EmbedMessages.CommandsMsgEmbed);
    }
    
    else if (msg.content.toLowerCase() === `${prefix}info`) {
        msg.reply(EmbedMessages.BotInfoMsgEmbed);
    }
    else if (msg.content.toLowerCase() === `${prefix}manager`) {
        msg.reply(EmbedMessages.ManagersMsgEmbed);
    }
    else if (msg.content.toLowerCase().startsWith(`${prefix}target`))
    {
        var parameters = msg.content.split(' ');
        if (parameters.length > 1) {
            var para_1 = parameters[1];
            if (para_1 == "everyone") {
                to_everyone = true;
                to_here = false;
                to_notify_group_only = false;
                msg.reply("Set alarm target to: everyone");
            }
            else if (para_1 == "here") {
                to_everyone = false;
                to_here = true;
                to_notify_group_only = false;
                msg.reply("Set alarm target to: here");
            }
            else if (para_1 == "notify_group") {
                to_everyone = false;
                to_here = false;
                to_notify_group_only = true;
                msg.reply("Set alarm target to: notify group only");
            }
            else {
                to_everyone = false;
                to_here = false;
                msg.reply("Set alarm target to: None");
            }
        }
        else
        {
            to_everyone = false;
            to_here = false;
            msg.reply("Set alarm target to: None");
        }
    }
    else {
        if (msg.content.toLowerCase().startsWith(`${prefix}`)) {
            msg.reply('Command not found. Please use ">>help" for detail.');
        }
    }
});

async function clean_all_message_in_channel() {
    const all_message = [];
    let last_id;
    let msg_size = 100;
    while (msg_size >= 50) {
        const options = { limit: 50 };
        if (last_id) {
            options.before = last_id;
        }

        await channel.messages.fetch(options).then(messages => {
            messages.forEach(msg => { all_message.push(msg) })
            last_id = messages.last().id;
            msg_size = messages.size;
        });
    }

    console.log("Total message numbers: " + all_message.length);

    all_message.pop(); // Not delete the first message in channel
    all_message.forEach(msg => {
        console.log("Delete message: " + msg.content)
        msg.delete({ reason: "Clean Message" })
    })
}

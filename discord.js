const Discord = require('discord.js');
const token = process.env.TOKEN
const client = new Discord.Client();

client.login(token).then(loggin => {
    // Yay, it worked!
    console.log("Logging Successfully.");
}).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
});

// console.log(ok);
// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.get("775200284263317507");
    channel.send('MapleBot is online!')
});

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
    // 如果訊息的內容是 'ping'
    if (msg.content === 'ping') {
        // 則 Bot 回應 'Pong'
        msg.reply('pong');
    }
});

# MapleBot
MapleBot for Discord.
Auto scan calendar if there are events send message to channel (according to CHANNEL_ID) and mention specific role (according to ROLE_ID)

## Requirements
1. [Nodejs](https://nodejs.org/en/)
2. ([discord.js](https://discord.js.org/#/)) (npm install discord.js)
3. Turn the [SERVER MEMBERS INTENT] on at your bot setting page. [Link](https://discord.com/developers/applications)

## How to run in Windows
1. Set environment before you run
```
> set BOT_ID=your bot id
> set CALENDAR_ID=your canlendar id
> set CHANNEL_ID=your channel id
> set CHAT_CHANNEL_ID=your chat channel id
> set CLIENT_ID=your client id
> set CLIENT_SECRET=your client secret
> set GOOGLE_TOKEN=your google token (if you run the heroku branch, this is needed)
> set REDIRECT_URI=your redirect uri
> set ROLE_CHANNEL_ID=your role channel id
> set ROLE_ID=your role id
> set TOKEN=your token
> set SERVER_CHANNEL_DATA={"Channel":[{"Name":"CH01", "IP":"202.80.104.94", "Port":8585, "Latency": 999}, {"Name":"CH02", "IP":"202.80.104.94", "Port":8686, "Latency": 999}, {"Name":"CH03", "IP":"202.80.104.95", "Port":8585, "Latency": 999}, {"Name":"CH04", "IP":"202.80.104.95", "Port":8686, "Latency": 999}, {"Name":"CH05", "IP":"202.80.104.96", "Port":8585, "Latency": 999}, {"Name":"CH06", "IP":"202.80.104.96", "Port":8686, "Latency": 999}, {"Name":"CH07", "IP":"202.80.104.97", "Port":8585, "Latency": 999}, {"Name":"CH08", "IP":"202.80.104.97", "Port":8686, "Latency": 999}, {"Name":"CH09", "IP":"202.80.104.98", "Port":8585, "Latency": 999}, {"Name":"CH10", "IP":"202.80.104.98", "Port":8686, "Latency": 999}, {"Name":"CH11", "IP":"202.80.104.99", "Port":8585, "Latency": 999}, {"Name":"CH12", "IP":"202.80.104.99", "Port":8686, "Latency": 999}, {"Name":"CH13", "IP":"202.80.104.100", "Port":8585, "Latency": 999}, {"Name":"CH14", "IP":"202.80.104.100", "Port":8686, "Latency": 999}, {"Name":"CH15", "IP":"202.80.104.101", "Port":8585, "Latency": 999}, {"Name":"CH16", "IP":"202.80.104.101", "Port":8686, "Latency": 999}, {"Name":"CH17", "IP":"202.80.104.102", "Port":8585, "Latency": 999}, {"Name":"CH18", "IP":"202.80.104.102", "Port":8686, "Latency": 999}, {"Name":"CH19", "IP":"202.80.104.103", "Port":8585, "Latency": 999}, {"Name":"CH20", "IP":"202.80.104.103", "Port":8686, "Latency": 999}, {"Name":"CH21", "IP":"202.80.104.104", "Port":8585, "Latency": 999}, {"Name":"CH22", "IP":"202.80.104.104", "Port":8686, "Latency": 999}, {"Name":"CH23", "IP":"202.80.104.105", "Port":8585, "Latency": 999}, {"Name":"CH24", "IP":"202.80.104.105", "Port":8686, "Latency": 999}, {"Name":"CH25", "IP":"202.80.104.106", "Port":8585, "Latency": 999}, {"Name":"CH26", "IP":"202.80.104.106", "Port":8686, "Latency": 999}, {"Name":"CH27", "IP":"202.80.104.107", "Port":8585, "Latency": 999}, {"Name":"CH28", "IP":"202.80.104.107", "Port":8686, "Latency": 999}, {"Name":"CH29", "IP":"202.80.104.108", "Port":8585, "Latency": 999}, {"Name":"CH30", "IP":"202.80.104.108", "Port":8686, "Latency": 999}], "Mall":[{"Name":"商城", "IP":"202.80.104.42", "Port":8686, "Latency": 999}], "Market":[{"Name":"拍賣", "IP":"202.80.104.42", "Port":8787, "Latency": 999}], "Instanced":[{"Name":"副本", "IP":"202.80.104.34", "Port":8686, "Latency": 999}]}
```
2. Run discord.js
```
> node discord.js
```

## Commands in this bot
You can using >>help for detail in discord.
```
>>alarm
Control and check the status of alarm.
  -on: Turn on the event alarm.
  -off: Turn off the event alarm.
  -status: Show alarm status.
>>clean
Clean all messages in the channel.
>>event
Fetch events in this hour
>>help
Show command list
>>info
Show informations of bot
>>manager
Show manager information of guild
>>target
The target to remind.
  -everyone: Every user even offline.
  -here: Users online only.
  -notify_group: Notify specific group.
```
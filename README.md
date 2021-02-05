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
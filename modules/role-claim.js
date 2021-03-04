const firstMessage = require('./first-message')

module.exports = (client) => {
    const role_channel_id = process.env.ROLE_CHANNEL_ID
    const bot_id = process.env.BOT_ID

    const getEmoji = (emojiName) =>
        client.emojis.cache.find((emoji) => emoji.name === emojiName)

    const emojis = {
        bot: 'BOT通知',
        mud: '萌新',
        hair_ticket: '負責可愛'
    }

    const reactions = []

    let emojiText = '點選下方icon加入或退出身分群\n\n'
    for (const key in emojis) {
      const emoji = getEmoji(key)
      reactions.push(emoji)

      const role = emojis[key]
      emojiText += `${emoji} = ${role}\n`
    }

    firstMessage(client, role_channel_id, emojiText, reactions)

    const handleReaction = (reaction, user, add) => {
        if (user.id === bot_id) {
            return
        }

        const emoji = reaction._emoji.name

        const { guild } = reaction.message

        const roleName = emojis[emoji]
        if (!roleName) {
            return
        }

        const role = guild.roles.cache.find((role) => role.name === roleName)
        const member = guild.members.cache.find((member) => member.id === user.id)

        if (add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === role_channel_id) {
            handleReaction(reaction, user, true)
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === role_channel_id) {
            handleReaction(reaction, user, false)
        }
    })
}

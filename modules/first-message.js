const addReactions = (message, reactions) => {
    message.react(reactions[0])
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750)
    }
}

module.exports = async (client, id, text, reactions = []) => {
    const channel = await client.channels.fetch(id)
    const all_message = [];
    let last_id;
    let msg_size = 100;

    // Fetch all messages
    while (msg_size >= 50) {
        const options = { limit: 50 };
        if (last_id) {
            options.before = last_id;
        }

        await channel.messages.fetch(options).then(messages => {
            msg_size = messages.size;
            if (messages.size > 0) {
                messages.forEach(msg => { all_message.push(msg) })
                last_id = messages.last().id;
            }
        });
    }

    if (all_message.length === 0) {
        // Send a new message
        channel.send(text).then((message) => {
            addReactions(message, reactions)
        })
    } else {
        // Edit the existing message
        first_message = all_message.pop();
        first_message.edit(text)
        addReactions(first_message, reactions)
    }
}

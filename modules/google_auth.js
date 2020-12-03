const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const client_secret = process.env.CLIENT_SECRET
const client_id = process.env.CLIENT_ID
const redirect_uri = process.env.REDIRECT_URI
const google_token = process.env.GOOGLE_TOKEN

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './modules/token.json';
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(msg) {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, msg);
        oAuth2Client.setCredentials(JSON.parse(google_token));
        resolve('Authorize success');
    });
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
function getAccessToken(Client, msg) {
    const authUrl = Client.generateAuthUrl({access_type: 'offline', scope: SCOPES,});
    msg.reply('Authorize this app by visiting this url:' + authUrl);
    // console.log('Authorize this app by visiting this url:', authUrl);
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    // });
    msg.reply('Enter the code from that page here:');
    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
            // only accept messages by the user who sent the command
            // accept only 1 message, and return the promise after 30000ms = 30s
            // first (and, in this case, only) message of the collection
            if (collected.first().content != '') {
                Client.getToken(collected.first().content, (err, token) => {
                    if (err) return msg.reply('Error retrieving access token' + err);
                    Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return msg.reply(err);
                        msg.reply('Token stored to' + TOKEN_PATH);
                    });
                });
            }
            else {
                msg.reply('Operation canceled.');
            }
    }).catch(() => {
        msg.reply('No answer after 30 seconds, operation canceled.');
    });
}

module.exports = oAuth2Client
module.exports.authorize = function (msg) {
    return new Promise((resolve, reject) => {
        console.log("authorize...")
        authorize(msg);
        resolve(true)
        console.log("Done.")
    }).catch(error => { return; });
};
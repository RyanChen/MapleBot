const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const client_secret = process.env.CLIENT_SECRET
const client_id = process.env.CLIENT_ID
const redirect_uri = process.env.REDIRECT_URI
const page_code = process.env.PAGE_CODE

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
function authorize() {
    console.log("authorize...")
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
function getAccessToken(Client) {
    const authUrl = Client.generateAuthUrl({access_type: 'offline', scope: SCOPES,});
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', () => {
        rl.close();
        Client.getToken(page_code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            Client.setCredentials(token);
            console.log(Client)
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
}

authorize()
module.exports = oAuth2Client
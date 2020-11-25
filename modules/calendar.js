const {google} = require('googleapis');
const oAuth2Client = require('./google_auth.js')
const calendarId = process.env.CALENDAR_ID

module.exports.get_event = function () {
    return listEventsPromiss()
};

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
let listEventsPromiss = () => {
    return new Promise((resolve, reject) => {
        let event_list = new Array();
        // var now = new Date(2020, 11, 20, 22, 0, 0);
        var now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        now_iso = now.toISOString()

        var now_timestamp = (new Date(now_iso)).getTime();
        // var next_hour_timestamp = now.setHours(now.getHours() + 1);
        var next_timestamp = now.setMinutes(now.setMinutes() + 5);
        var next_datetime = new Date(next_timestamp)
        var next_iso = next_datetime.toISOString();

        const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
        console.log(now_iso)
        console.log(next_iso)
        calendar.events.list({
            calendarId: calendarId,
            timeMax: next_iso,
            timeMin: now_iso,
            // maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(event_list);
            }
            const events = res.data.items;
            if (events.length) {
                console.log('Upcoming events:');
                events.map((event, i) => {
                    event_item = {}
                    const start = event.start.dateTime || event.start.date;
                    const end = event.end.dateTime || event.end.date;
                    console.log(`${start} ~ ${end} - ${event.summary} - ${event.description}`);
                    start_datetime = (new Date(start)).getTime()
                    end_datetime = (new Date(end)).getTime()

                    // Compare in timestamp
                    if ((start_datetime >= now_timestamp && start_datetime <= next_timestamp) || (end_datetime >= now_timestamp && end_datetime >= next_timestamp))
                    {
                        event_item['start'] = start
                        event_item['end'] = end
                        event_item['summary'] = event.summary
                        event_item['description'] = event.description == undefined ? "" : event.description
                        event_list.push(event_item)
                    }
                });

                resolve(event_list);
            } else {
                console.log('No upcoming events found.');
                reject(event_list);
            }
            resolve(event_list);
            console.log("==========")
            console.log(event_list)
            console.log("==========")
        });
    }).catch(error => { return new Array(); });
};

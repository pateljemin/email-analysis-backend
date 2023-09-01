const { google } = require('googleapis');

/**
 * This function is responsible to return gmails for given accessToken
 * 
 * @param {*} accessToken 
 * @returns 
 */
const readGmails = async(accessToken) => {
    const oAuth2Client = getOAuth2Client(accessToken);

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    try {
        const messagesIds = await listGmails(gmail, oAuth2Client);
        const gmailsWithContent = await getGmailsContent(messagesIds, gmail, oAuth2Client);

        return { isSuccess: true, emails: gmailsWithContent };
    } catch (e) {
        console.error(`[gmailService][readGmails] Error while reading gmails`, e);
        return { isSuccess: false, message: 'Something went wrong!' };
    }
}

/**
 * This function will list gmails using given gmail auth token.
 * 
 * @param {*} gmail 
 * @param {*} auth 
 * @returns 
 */
const listGmails = async(gmail, auth) => {

    try {
        const messagesResponse = await gmail.users.messages.list({
            userId: 'me',
            q: 'in:sent', // Search for sent messages
            auth,
            maxResults: 50
        });

        return messagesResponse.data.messages || [];
    } catch (e) {
        console.error(`[gmailService][listGmails] Error while getting gmails ids`, e);
        throw e;
    }
}

/**
 * This function will read messages actual content using gmail auth
 * 
 * @param {*} messages : List of messages with id
 * @param {*} gmail 
 * @param {*} auth 
 * @returns 
 */
const getGmailsContent = async(messages, gmail, auth) => {
    const gmailsContent = [];
    try {
        for (const message of messages) {
            const messageData = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                auth,
            });

            const emailContent = messageData.data.snippet;
            gmailsContent.push(emailContent);
        }
    } catch (e) {
        console.error(`[gmailService][getGmailsContent] Error while getting gmail content`, e);
        throw e;
    }

    return gmailsContent;
}

/**
 * This function will give oAuth2Client from access token
 * 
 * @param {*} accessToken 
 * @returns oAuthClient
 */
const getOAuth2Client = (accessToken) => {

    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );
    oAuth2Client.setCredentials({ access_token: accessToken });

    return oAuth2Client;
}

module.exports = {
    readGmails
}
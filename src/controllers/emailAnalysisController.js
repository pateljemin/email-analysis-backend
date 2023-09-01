const { findRepeatedParagraphSortedByCount } = require('../services/emailAnalysisService');
const { readGmails } = require('../services/gmailService');

/**
 * Email Analysis controller.
 *
 * @param req : Http Request with title and content.
 * @param res : Http Response
 */
const analyzeEmails = async(req, res) => {
    const { accessToken } = req.body;

    // Check that the request includes a title and content
    if (!accessToken) {
        return res.status(400).json({ message: 'Missing access token' });
    }

    const readGmailResult = await readGmails(accessToken);
    if (!readGmailResult.isSuccess) {
        return res.status(500).json({ message: readGmailResult.message });
    }
    const findSnippetResult = findRepeatedParagraphSortedByCount(readGmailResult.emails);
    if (!findSnippetResult.isSuccess || !findSnippetResult.snippets) {
        return res.status(500).json({ message: 'Something went wrong on server side' })
    }

    res.status(200).json({ snippets: findSnippetResult.snippets });
};

module.exports = {
    analyzeEmails
}
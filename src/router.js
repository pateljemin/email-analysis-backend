const router = require('express-promise-router')();

const { analyzeEmailsValidator } = require('./validators/emailAnalysisValidator');

const { analyzeEmails } = require('./controllers/emailAnalysisController');

router.post('/analyze-emails', analyzeEmailsValidator, analyzeEmails);

module.exports = {
    router
}
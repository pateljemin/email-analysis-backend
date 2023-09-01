const Joi = require('joi');

const options = {
    abortEarly: true, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true, // remove unknown props
};

const analyzeEmailsValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        accessToken: Joi.string().required()
    });

    const { error } = schema.validate(req.body || req.query || req.params, options);

    if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(',');

        return res.status(400).json({ message })
    }

    next();
}


module.exports = {
    analyzeEmailsValidator
}
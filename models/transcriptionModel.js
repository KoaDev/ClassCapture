const Joi = require('joi');

const TranscriptionModel = Joi.object({
    id: Joi.string().required(),
    uid: Joi.string().required(),
    text: Joi.string().required(),
    createdAt: Joi.date().required(),
    path: Joi.string().required(),
    metadata: Joi.object({
        size: Joi.number().optional(),
        contentType: Joi.string().default('application/json'),
        updatedAt: Joi.date().optional(),
    }).optional(),
});

module.exports = TranscriptionModel;

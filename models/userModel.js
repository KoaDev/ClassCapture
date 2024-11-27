const Joi = require('joi');

const UserModel = Joi.object({
    uid: Joi.string().optional(),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).max(128).optional().label("Password"),
    createdAt: Joi.date().default(() => new Date()).label("Creation Date"),
    lastLoginAt: Joi.date().optional().label("Last Login Date"),
});

module.exports = UserModel;

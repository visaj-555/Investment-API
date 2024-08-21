const Joi = require('joi');

const validateGoldMaster = (req, res, next) => {
    const schema = Joi.object({
        goldRate22KPerGram: Joi.number().positive()
            .required()
            .messages({
                'number.base': 'Gold rate for 22K per gram must be a number',
                'number.positive': 'Gold rate for 22K per gram must be a positive number',
                'any.required': 'Gold rate for 22K per gram is required'
            }),
        goldRate24KPerGram: Joi.number().positive()
            .required()
            .messages({
                'number.base': 'Gold rate for 24K per gram must be a number',
                'number.positive': 'Gold rate for 24K per gram must be a positive number',
                'any.required': 'Gold rate for 24K per gram is required'
            }),
        gst: Joi.number().positive()
            .required()
            .messages({
                'number.base': 'GST must be a number',
                'number.positive': 'GST must be a positive number',
                'any.required': 'GST is required'
            }),
        makingChargesPerGram: Joi.number().positive()
            .required()
            .messages({
                'number.base': 'Making charges per gram must be a number',
                'number.positive': 'Making charges per gram must be a positive number',
                'any.required': 'Making charges per gram is required'
            }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = { validateGoldMaster };
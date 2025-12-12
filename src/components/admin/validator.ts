import { UploadedFile } from "express-fileupload";
import Joi from "joi";


export const createNewVacationValidator = Joi.object({
    destination: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(20).required(),
    startTime: Joi.date().required().min('now'),
    endTime: Joi.date().required().min(Joi.ref('startTime')),
    price: Joi.number().min(1).max(10000).required(),
    // image: Joi.object()
}).unknown(true);

export const newVacationImageValidator = Joi.object({
    // image: Joi.object({
    //     mimetype: Joi.string().valid('image/jpeg', 'image/png')
    // }).unknown(true).required()

    image: Joi.object<UploadedFile>({
        mimetype: Joi.string()
            .valid('image/jpeg', 'image/png')
            .required()
            .messages({
                'any.only': 'Image must be a JPEG or PNG file',
                'any.required': 'Image is required!',
            }),
    }).unknown(true)
        .required()
        .messages({
            'any.required': 'Image is required!!!',
        }),
})

export const updateVacationValidator = Joi.object({
    destination: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(20).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required().min(Joi.ref('startTime')),
    price: Joi.number().min(1).max(10000).required(),
    image: Joi.any().optional()
})

export const updateVacationImageValidator = Joi.object({
    // image: Joi.object({
    //     mimetype: Joi.string().valid('image/jpeg', 'image/png')
    // }).unknown(true).required()

    image: Joi.object<UploadedFile>({
        mimetype: Joi.string()
            .valid('image/jpeg', 'image/png')
            .messages({
                'any.only': 'Image must be a JPEG or PNG file',
            }),
    }).unknown(true).optional()
})



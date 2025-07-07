import Joi from "joi";

export const createUserSchema = Joi.object({
    username : Joi.string().required().alphanum().min(3).max(30),
    password: Joi.string().required(),
})
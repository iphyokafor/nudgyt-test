import * as Joi from "joi";

export const createUserValidator = Joi.object({
    firstName: Joi.string().uppercase().required(),
    lastName: Joi.string().uppercase().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  export const LoginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
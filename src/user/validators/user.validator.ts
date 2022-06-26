import * as Joi from "joi";
import { Types } from "mongoose";

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

  export const UpdateUserValidator = Joi.object({
    firstName: Joi.string().uppercase(),
    lastName: Joi.string().uppercase(),
    email: Joi.string().email().forbidden(),
    password: Joi.string().forbidden(),
  });

  export const objectIdValidator = Joi.string().custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    throw new Error('please provide a valid object id');
  });

  export const paginationValidator = Joi.object({
    limit: Joi.number().default(50),
    page: Joi.number().default(1),
    searchTerm: Joi.string().default(''),
    startDate: Joi.date().default(null),
    endDate: Joi.date().default(null),
  });
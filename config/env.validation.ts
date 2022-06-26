import * as Joi from 'joi';
import { envConfiguration as env } from './env.configuration';

// define validation for all env variables
export const envValidationSchema = Joi.object({
  [env.MONGODB_COMPASS]: Joi.string().trim().required(),
  [env.PORT]: Joi.number(),
  [env.JWT_SECRET_KEY]: Joi.string().required(),
  [env.JWT_EXPIRES]: Joi.string().required(),
  [env.NODE_ENV]: Joi.string()
    .trim()
    .valid('development', 'production', 'staging'),
});

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  IMG_URL: string;
  IMGUR_CLIENT_ID: string;
  IMGUR_CLIENT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    IMG_URL: joi.string().required(),
    IMGUR_CLIENT_ID: joi.string().required(),
    IMGUR_CLIENT_SECRET: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dataBaseUrl: envVars.DATABASE_URL,
  IMG_URL: envVars.IMG_URL,
  IMGUR_CLIENT_ID: envVars.IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET: envVars.IMGUR_CLIENT_SECRET,
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
};

import * as Joi from "joi";
import { JWTConfigType } from "../configs/jwt.config";

export function jwtConfigSchema(
  required = false,
  configPrefix = "JWT",
  configKeys = null
) {
  let keys: { [x in keyof JWTConfigType]: string } = {
    secret: "SECRET",
    expiresIn: "EXPIRES_IN",
  };

  if (configPrefix != "") {
    for (const key in keys) {
      keys[key] = `${configPrefix}_${keys[key]}`;
    }
  }

  if (configKeys != null) {
    keys = configKeys;
  }

  const schema = {};
  schema[`${keys.secret}`] = Joi.string().default("");
  schema[`${keys.expiresIn}`] = Joi.string().default("");

  if (required) {
    for (const key in schema) {
      schema[key] = schema[key].required();
    }
  }

  return schema;
}

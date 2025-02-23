import * as Joi from "joi";
import { HOST_SCHEMA } from "./common.schema";
import { redisConfigSchema } from "./redis.schema";
import { MongoDBConfigType } from "../configs/mongodb.config";
import { CONFIG_KEYS } from "@app/share/common/constants";
export function mongodbConfigSchema(
  required = false,
  configPrefix = CONFIG_KEYS.MONGODB,
  configKeys = null
) {
  let keys: { [x in keyof MongoDBConfigType]: string } = {
    uri: "URI",
    cacheEnable: "CACHE_ENABLE",
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
  schema[`${configPrefix}_URI`] = HOST_SCHEMA.default(
    "mongodb://admin:example@localhost:27017/p90db"
  );
  schema[`${configPrefix}_CACHE_ENABLE`] = Joi.boolean().default(false);

  if (required) {
    for (const key in schema) {
      schema[key] = schema[key].required();
    }
  }

  return {
    ...schema,
    ...(process.env[`${configPrefix}_CACHE_ENABLE`] == "true" &&
      redisConfigSchema(required, `${configPrefix}_CACHE`)),
  };
}

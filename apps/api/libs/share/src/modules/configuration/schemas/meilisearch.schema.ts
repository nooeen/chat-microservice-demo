import * as Joi from "joi";
import { HOST_SCHEMA } from "./common.schema";
import { MeilisearchConfigType } from "../configs/meilisearch.config";
import { CONFIG_KEYS } from "@app/share/common/constants";

export function meilisearchConfigSchema(
  required = false,
  configPrefix = CONFIG_KEYS.MEILISEARCH,
  configKeys = null
) {
  let keys: { [x in keyof MeilisearchConfigType]: string } = {
    url: "URL",
    key: "KEY",
  };

  if (configPrefix != "") {
    for (const key in keys) {
      keys[key] = `${configPrefix}_${keys[key]}`;
    }
  }

  const schema = {};
  schema[`${keys.url}`] = HOST_SCHEMA.default("http://localhost:7700");
  schema[`${keys.key}`] = Joi.string().default("masterKey");

  if (required) {
    for (const key in schema) {
      schema[key] = schema[key].required();
    }
  }

  return schema;
}

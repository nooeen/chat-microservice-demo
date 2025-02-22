import * as Joi from "joi";
import { HOST_SCHEMA } from "./common.schema";
import { RabbitMQConfigType } from "../configs/rabbitmq.config";
import { CONFIG_KEYS } from "@app/share/common/constants";
export function rabbitmqConfigSchema(
  required = false,
  configPrefix = CONFIG_KEYS.RABBITMQ,
  configKeys = null
) {
  let keys: { [x in keyof RabbitMQConfigType]: string } = {
    uri: "URI",
    queue: "QUEUE",
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
  schema[`${keys.uri}`] = HOST_SCHEMA.default("localhost");
  schema[`${keys.queue}`] = Joi.string().default("");

  if (required) {
    for (const key in schema) {
      schema[key] = schema[key].required();
    }
  }

  return schema;
}

import { CONFIG_KEYS } from "@app/share/common/constants";

export type RabbitMQConfigType = {
  uri: string;
  queue: string;
};

export const buildRabbitMQConfig = (
  configKeymap = CONFIG_KEYS.RABBITMQ,
  configPrefix = CONFIG_KEYS.RABBITMQ,
  configKeys = null
) => {
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

  const config = {};
  config[configKeymap] = {
    uri: process.env[keys.uri],
    queue: process.env[keys.queue],
  };

  return config;
};

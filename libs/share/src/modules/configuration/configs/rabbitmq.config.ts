import { CONFIG_KEYS } from "@app/share/common/constants";

export type RabbitMQConfigType = {
  uri: string;
  authQueue: string;
  chatQueue: string;
};

export const buildRabbitMQConfig = (
  configKeymap = CONFIG_KEYS.RABBITMQ,
  configPrefix = CONFIG_KEYS.RABBITMQ,
  configKeys = null
) => {
  let keys: { [x in keyof RabbitMQConfigType]: string } = {
    uri: "URI",
    authQueue: "AUTH_QUEUE",
    chatQueue: "CHAT_QUEUE",
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
    authQueue: process.env[keys.authQueue],
    chatQueue: process.env[keys.chatQueue],
  };

  return config;
};

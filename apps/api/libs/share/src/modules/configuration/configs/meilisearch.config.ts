import { CONFIG_KEYS } from "@app/share/common/constants";

export type MeilisearchConfigType = {
  url: string;
  key: string;
};

export const buildMeilisearchConfig = (
  configKeymap = CONFIG_KEYS.MEILISEARCH,
  configPrefix = CONFIG_KEYS.MEILISEARCH,
  configKeys = null
) => {
  let keys: { [x in keyof MeilisearchConfigType]: string } = {
    url: "URL",
    key: "KEY",
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
    url: process.env[keys.url],
    key: process.env[keys.key],
  };

  return config;
};

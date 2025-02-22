import { CONFIG_KEYS } from "@app/share/common/constants";

export type JWTConfigType = {
  secret: string;
  expiresIn: string;
};

export const buildJWTConfig = (
  configKeymap = CONFIG_KEYS.JWT,
  configPrefix = CONFIG_KEYS.JWT,
  configKeys = null
) => {
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

  const config = {};
  config[configKeymap] = {
    secret: process.env[keys.secret],
    expiresIn: process.env[keys.expiresIn],
  };

  return config;
};

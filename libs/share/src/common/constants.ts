export const CONFIG_KEYS = {
  JWT: "JWT",
  RABBITMQ: "RABBITMQ",
  REDIS: "REDIS",
  MONGODB: "MONGODB",
  MEILISEARCH: "MEILISEARCH",
};

export const CACHE_5M = 300; //5*60
export const CACHE_10M = 600; //10*60
export const CACHE_15M = 900; //15*60
export const CACHE_30M = 1800; //30*60
export const CACHE_60M = 3600; //60*60
export const CACHE_120M = 7200; //120*60

export const HEADER_CACHE_HOUR = "public, max-age=60, s-maxage=3600";
export const HEADER_CACHE_30_MINUTES = "public, max-age=60, s-maxage=1800";
export const HEADER_CACHE_15_MINUTES = "public, max-age=60, s-maxage=900";
export const HEADER_CACHE_5_MINUTES = "public, max-age=60, s-maxage=300";
export const HEADER_CACHE_DEFAULT = "public, max-age=10, s-maxage=120";
export const HEADER_CACHE_FAST = "public, max-age=10, s-maxage=30";
export const HEADER_CACHE_FAST_LIVE = "public, max-age=40, s-maxage=60";
export const HEADER_CACHE_2_SECONDS = "public, max-age=1, s-maxage=2";
export const HEADER_CACHE_1_SECOND = "public, max-age=1, s-maxage=1";
export const HEADER_CACHE_NO = "no-cache";
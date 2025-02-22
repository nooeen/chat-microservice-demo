export const CONFIG_KEYS = {
  JWT: "JWT",
  RABBITMQ: "RABBITMQ",
  REDIS: "REDIS",
  MONGODB: "MONGODB",
  MEILISEARCH: "MEILISEARCH",
  QUEUE: "QUEUE",
};

export const MICROSERVICE_KEYS = {
  AUTH: "AUTH_SERVICE",
  CHAT: "CHAT_SERVICE",
};

export const API_PATHS = {
  REGISTER: "register",
  LOGIN: "login",
  VALIDATE: "validate",
  GET_CONVERSATION: "conversation",
  GET_RECENT_CONVERSATIONS: "recent-conversations",
  ACTIVE_USERS: "active-users",
};

export const AUTH_COMMANDS = {
  REGISTER: "register",
  VALIDATE_USER: "validate-user",
  GENERATE_TOKEN: "generate-token",
  VALIDATE_TOKEN: "validate-token",
};

export const CHAT_COMMANDS = {
  SAVE_MESSAGE: "save-message",
  GET_CONVERSATION: "get-conversation",
  GET_RECENT_CONVERSATIONS: "get-recent-conversations",
  GET_ACTIVE_USERS: "get-active-users",
};

export const REDIS_HASH_KEYS = {
  USER_SOCKETS_MAPPING: 'user_sockets_mapping',
  SOCKET_USER_MAPPING: 'socket_user_mapping',
} as const;

export const SOCKET_EVENTS = {
  PING: 'ping',
  CONNECTED_INSTANCE: 'connected_instance',
  ONLINE_USERS: 'online_users',
  ON_MESSAGE: 'on_message',
  EMIT_MESSAGE: 'emit_message',
} as const;

export const CACHE_1S = 1; //1
export const CACHE_2S = 2; //2
export const CACHE_5M = 300; //5*60
export const CACHE_10M = 600; //10*60
export const CACHE_15M = 900; //15*60
export const CACHE_30M = 1800; //30*60
export const CACHE_40M = 2400; //40*60
export const CACHE_60M = 3600; //60*60
export const CACHE_120M = 7200; //120*60

export const HEADER_CACHE_NO = "no-cache";
export const HEADER_CACHE_DEFAULT = `public, max-age=${CACHE_10M}, s-maxage=${CACHE_120M}`;
export const HEADER_CACHE_FAST = `public, max-age=${CACHE_10M}, s-maxage=${CACHE_30M}`;
export const HEADER_CACHE_FAST_LIVE = `public, max-age=${CACHE_40M}, s-maxage=${CACHE_60M}`;
export const HEADER_CACHE_1_SECOND = `public, max-age=${CACHE_1S}, s-maxage=${CACHE_1S}`;
export const HEADER_CACHE_2_SECONDS = `public, max-age=${CACHE_2S}, s-maxage=${CACHE_2S}`;
export const HEADER_CACHE_5_MINUTES = `public, max-age=${CACHE_5M}, s-maxage=${CACHE_5M}`;
export const HEADER_CACHE_10_MINUTES = `public, max-age=${CACHE_10M}, s-maxage=${CACHE_10M}`;
export const HEADER_CACHE_15_MINUTES = `public, max-age=${CACHE_15M}, s-maxage=${CACHE_15M}`;
export const HEADER_CACHE_30_MINUTES = `public, max-age=${CACHE_30M}, s-maxage=${CACHE_30M}`;
export const HEADER_CACHE_HOUR = `public, max-age=${CACHE_60M}, s-maxage=${CACHE_60M}`;
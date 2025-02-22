import { CONFIG_KEYS } from "@app/share/common/constants";
import { buildRedisConfig } from "./redis.config";

export const buildQueueConfig = () => buildRedisConfig(CONFIG_KEYS.QUEUE, CONFIG_KEYS.QUEUE);

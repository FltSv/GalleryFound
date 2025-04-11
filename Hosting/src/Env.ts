/// <reference types="vite/client" />

interface EnvType {
  MAPS_JS_API: string;
}

export const Env = {
  MAPS_JS_API: (() => {
    const env = import.meta.env.VITE_MAPS_JS_API;
    if (env === undefined) throw new Error(`MAPS_JS_API is undefined.`);
    return env;
  })(),
} as const satisfies EnvType;

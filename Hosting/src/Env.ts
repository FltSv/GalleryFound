interface EnvType {
  MAPS_JS_API: string;
}

export const Env = {
  MAPS_JS_API: (() => {
    const env = process.env.MAPS_JS_API;
    if (env === undefined) throw new Error(`MAPS_JS_API is undefined.`);
    return env;
  })(),
} as const satisfies EnvType;

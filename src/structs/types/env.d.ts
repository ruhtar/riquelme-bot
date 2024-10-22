declare namespace NodeJS {
    interface ProcessEnv {
        BOT_TOKEN: string;
        GUILD_ID: string;
        CHANNEL_ID: string;
        OPENAI_KEY: string;
        TWITCH_CLIENT_ID: string;
        TWITCH_CLIENT_SECRET: string;
    }
}
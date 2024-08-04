import { BitFieldResolvable, Client, GatewayIntentsString, IntentsBitField, Partials } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();


//Configure os Intents -> São as permissões que o Cliente precisa ter para interagir com determinados eventos.
export class ExtendedClient extends Client {
    constructor() {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [
                Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent,
                Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User
            ]
        })
    }

    public start() {
        this.login(process.env.BOT_TOKEN)
    }
}
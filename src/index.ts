  export { client };
  import * as dotenv from "dotenv";
  import schedule from 'node-schedule';
  import { DatabaseInitializer } from "./database/database-initializer";
  import { checkBirthday } from "./managers/birthday-manager";
  import { CommandManager } from "./managers/command-mananger";
  import { VoiceTimeManager } from "./managers/voice-time-manager";
  import { ExtendedClient } from "./structs/ExtendedClient";

dotenv.config();
const client = new ExtendedClient();
new DatabaseInitializer();
const commandManager = new CommandManager();
client.start();
const voiceTimeManager = new VoiceTimeManager();

schedule.scheduleJob('0 0 * * *', function(){
  console.log("Executando verificação de aniversário todos os dias à meia-noite.");
  checkBirthday();
});

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceTimeManager.CountUsersTimeOnVoice(oldState, newState);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  const content = message.content;

  if (content.startsWith("!")) {
      const command = content.slice(1).toLowerCase();
      await commandManager.handleCommand(message, command);
  }
});

client.on("ready", () => {
  checkBirthday()

  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidô")

  // const channelId = process.env.CHANNEL_ID;

  // if(!channelId) return;

  // const channel = client.channels.cache.get(channelId);

  // if(!channel) return;

  // (channel as TextChannel).send({ content: "Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidô" })
  // .catch(err => { 
  //   console.error(err);
  // });
});
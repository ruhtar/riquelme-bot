export { client };
  import * as dotenv from "dotenv";
  import { DatabaseInitializer } from "./database/database-initializer";
  import { Repository } from "./database/repository";
  import { CommandManager } from "./managers/command-mananger";
  import { VoiceTimeManager } from "./managers/voice-time-manager";
  import { jobInit } from "./scheduled-jobs/jobs";
  import { ExtendedClient } from "./structs/ExtendedClient";

dotenv.config();

const client = new ExtendedClient();
new DatabaseInitializer();
const commandManager = new CommandManager();
client.start();
const voiceTimeManager = new VoiceTimeManager();

jobInit();

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceTimeManager.CountUsersTimeOnVoice(oldState, newState);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  const content = message.content;

  var repo = new Repository();

  repo.saveUserMessage(message.author.id, message.content);

  if (content.startsWith("!")) {
    const match = content.match(/(\!\w+)\s(\d{2}-\d{2})/);

    if (match) await commandManager.handleCommand(message, match[1].slice(1).toLowerCase(), match[2]);

    else await commandManager.handleCommand(message, content.slice(1).toLowerCase());
  }

  if (content.startsWith("?")) {
    const match = content.match(/(\?\w+)\s(\d{2}-\d{2})/);
  
    if (match) await commandManager.getCommandCounter(message, match[1].slice(1).toLowerCase(), match[2]);

     else await commandManager.getCommandCounter(message, content.slice(1).toLowerCase());
  }
});

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});
export * from "colors";
export { client };

  import { CommandHandler } from "./commands/commandHandler";
  import { DatabaseInitializer } from "./managers/databaseInitializer";
  import { VoiceTimeManager } from "./managers/voiceTimeManager";
  import { ExtendedClient } from "./structs/ExtendedClient";


const client = new ExtendedClient();
new DatabaseInitializer();
const commandHandler = new CommandHandler();

client.start();
const voiceTimeManager = new VoiceTimeManager();

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceTimeManager.CountUsersTimeOnVoice(oldState, newState);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  const content = message.content;

  if (content.startsWith("!")) {
      const command = content.slice(1).toLowerCase();
      await commandHandler.handleCommand(message, command);
  }
});

client.on("ready", () => {
  console.log("Burucutugurugudu akstiguiriguidô".blue);
});
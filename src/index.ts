export * from "colors";
export { client };

  import { VoiceTimeManager } from "./features/VoiceTimeManager";
  import { ExtendedClient } from "./structs/ExtendedClient";


const client = new ExtendedClient();
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
      await voiceTimeManager.handleCommand(message, command);
  }
});

client.on("ready", () => {
  console.log("Burucutugurugudu akstiguiriguidô".green);
});
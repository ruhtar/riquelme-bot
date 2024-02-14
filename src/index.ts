export * from "colors";
export { client };

  import { VoiceTimeManager } from "./features/VoiceTimeManager";
  import { ExtendedClient } from "./structs/ExtendedClient";


const client = new ExtendedClient();
client.start();

const voiceTimeManage = new VoiceTimeManager();

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceTimeManage.CountUsersTimeOnVoice(oldState, newState);
});

client.on("ready", () => {
  console.log("Burucutugurugudu akstiguiriguidô".green);
});

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  // message.reply({
  //     content: `Eae man, ${message.author.displayName}, ${message.author.username}, ${message.author.globalName}`
  // })
});

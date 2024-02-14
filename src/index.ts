export * from "colors";
export { client };

  import { ExtendedClient } from "./structs/ExtendedClient";

const voiceTime = new Map<string, number>();
const client = new ExtendedClient();
client.start();

client.on('voiceStateUpdate', (oldState, newState) => {
  const channelId = newState.channel?.id;
  const userId = newState.member?.id;

  if (channelId && userId) { // Entrou em um canal
    console.log("Entrou em um canal");
    const startTime = Math.floor(Date.now() / 1000); // Converte para segundos

    // Iniciar contagem de tempo se ainda não estiver em execução
    if (!voiceTime.has(userId)) {
      console.log("setou como", startTime)
      voiceTime.set(userId, startTime);
    }

    if (oldState.channel?.id) { // Saiu de um canal
      console.log("Saiu do canal");
      const endTime = Math.floor(Date.now() / 1000); // Converte para segundos

      const startTime = voiceTime.get(userId);

      if (startTime) {
        const timeInVoiceToAdd = endTime - startTime;
        console.log('timeInVoiceToAdd',timeInVoiceToAdd)

        if (voiceTime.has(userId)) {
          voiceTime.set(userId, startTime + timeInVoiceToAdd);
        }
      }
    }
  }
  console.log("voiceTime",voiceTime.get(userId!));
});

client.on("ready", () => {
  console.log("Burucutugurugudu akstiguiriguidô".green);
});

client.on("messageCreate", (message) => {
  if (message.author.id == client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  // message.reply({
  //     content: `Eae man, ${message.author.displayName}, ${message.author.username}, ${message.author.globalName}`
  // })
});

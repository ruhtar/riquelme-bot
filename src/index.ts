export * from "colors";
export { client };

  import { ExtendedClient } from "./structs/ExtendedClient";

const startTimePerUser = new Map<string, number>();
const voiceTime = new Map<string, number>();
const client = new ExtendedClient();
client.start();

client.on('voiceStateUpdate', (oldState, newState) => {
  const member = oldState.member || newState.member;
  const userId = member?.id;

  if (newState.channel && userId && !oldState.channel) {
    // Entrou em um canal
    console.log("Entrou em um canal");

    startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
    if (!voiceTime.has(userId)) {
      // Se o usuário não estava em um canal antes, inicializa o tempo
      voiceTime.set(userId, 0);
    }
  }

  if (oldState.channel && userId && !newState.channel) {
    // Saiu de um canal
    console.log("Saiu do canal");
    
    const endTime = Math.floor(Date.now() / 1000); // Converte para segundos
    const startTime = startTimePerUser.get(userId);

    const timeInVoiceToAdd = endTime - startTime!;
    console.log('timeInVoiceToAdd', timeInVoiceToAdd);

    const oldVoiceTime = voiceTime.get(userId) || 0;
    console.log('oldVoiceTime', oldVoiceTime);

    const newVoiceTime = oldVoiceTime + timeInVoiceToAdd;
    console.log("setou", newVoiceTime);

    voiceTime.set(userId, newVoiceTime);
    
    startTimePerUser.set(userId, 0); //reset
  }
  console.log("voiceTime", voiceTime.get(userId!));
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

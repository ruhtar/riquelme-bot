export * from "colors";
export { client };



  import { TextChannel } from "discord.js";
  import * as dotenv from "dotenv";
  import schedule from 'node-schedule';
  import { CommandHandler } from "./commands/commandHandler";
  import { parabens } from "./conts/birthdayMessages";
  import { birthdays } from "./conts/birthdays";
  import { DatabaseInitializer } from "./managers/databaseInitializer";
  import { VoiceTimeManager } from "./managers/voiceTimeManager";
  import { ExtendedClient } from "./structs/ExtendedClient";

dotenv.config();
const client = new ExtendedClient();

new DatabaseInitializer();
const commandHandler = new CommandHandler();

client.start();
const voiceTimeManager = new VoiceTimeManager();

function checkBirthday(){
  const hoje: Date = new Date();
  const dia: number = hoje.getDate();
  const mes: number = hoje.getMonth() + 1; // Lembrando que o mês é base 0 (janeiro é 0)
  const dataHoje: string = `${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  
  for (const pessoa in birthdays) {
      if (birthdays[pessoa] === dataHoje) {
          console.log(`Hoje é aniversário de ${pessoa}! 🎉🎂`);
          const channelId = process.env.CHANNEL_ID;

          if(!channelId) return;

          const channel = client.channels.cache.get(channelId);

          if(!channel) return;

          (channel as TextChannel).send({ content: parabens[3] })
          .catch(err => {
            console.error(err);
          });
      }
  }
}

schedule.scheduleJob('0 0 * * *', function(){
  checkBirthday();
  console.log("Executando verificação de aniversário todos os dias à meia-noite.");
});



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
  checkBirthday()
  console.log("Burucutugurugudu akstiguiriguidô".blue);
});
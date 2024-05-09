export * from "colors";
export { client };



  import { TextChannel } from "discord.js";
  import * as dotenv from "dotenv";
  import schedule from 'node-schedule';
  import { parabens } from "./conts/birthday/birthday-reply-messages";
  import { birthdays } from "./conts/birthday/birthdays-list";
  import { DatabaseInitializer } from "./database/database-initializer";
  import { CommandManager } from "./managers/command-mananger";
  import { VoiceTimeManager } from "./managers/voice-time-manager";
  import { ExtendedClient } from "./structs/ExtendedClient";

dotenv.config();
const client = new ExtendedClient();

new DatabaseInitializer();
const commandHandler = new CommandManager();

client.start();
const voiceTimeManager = new VoiceTimeManager();

function checkBirthday(){
  const hoje: Date = new Date();
  const dia: number = hoje.getDate();
  const mes: number = hoje.getMonth() + 1; // Lembrando que o mês é base 0 (janeiro é 0)
  const dataHoje: string = `${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  
  for (const pessoa in birthdays) {
      if (birthdays[pessoa] === dataHoje) {
          const channelId = process.env.CHANNEL_ID;

          if(!channelId) return;

          const channel = client.channels.cache.get(channelId);

          if(!channel) return;

          const randomIndex = Math.floor(Math.random() * parabens.length);
          const mensagemAleatoria = parabens[randomIndex];

          (channel as TextChannel).send({ content: mensagemAleatoria })
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

  const channelId = process.env.CHANNEL_ID;

  if(!channelId) return;

  const channel = client.channels.cache.get(channelId);

  if(!channel) return;

  (channel as TextChannel).send({ content: "Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidô" })
  .catch(err => { 
    console.error(err);
  });
});
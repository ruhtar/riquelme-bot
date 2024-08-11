export { client };
  import * as dotenv from "dotenv";
  import schedule from 'node-schedule';
  import { DatabaseInitializer } from "./database/database-initializer";
  import { checkBirthday } from "./managers/birthday-manager";
  import { CommandManager } from "./managers/command-mananger";
  import { generateReport } from "./managers/report-manager";
  import { VoiceTimeManager } from "./managers/voice-time-manager";
  import { ExtendedClient } from "./structs/ExtendedClient";

dotenv.config();

const client = new ExtendedClient();
new DatabaseInitializer();
const commandManager = new CommandManager();
client.start();
const voiceTimeManager = new VoiceTimeManager();

schedule.scheduleJob('0 3 * * *', function () {
  console.log("Executando verificação de aniversário todos os dias à meia-noite.");
  checkBirthday();
});


schedule.scheduleJob('0 3 1 * *', function () {
  console.log("Executando no primeiro dia do mês.");
  generateReport();
});

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceTimeManager.CountUsersTimeOnVoice(oldState, newState);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

  const content = message.content;

  if (content.startsWith("!")) {    
    const regex = /(\!\w+)\s(\d{2}-\d{2})/; 
    const match = content.match(regex);

    if(match){
      const command = match[1].slice(1).toLowerCase(); 
      const date = match[2]; 
      await commandManager.handleCommand(message, command, date);
    }else{
      const command = content.slice(1).toLowerCase();
      await commandManager.handleCommand(message, command);
    }
  }

  if (content.startsWith("?")) {
    const regex = /(\?\w+)\s(\d{2}-\d{2})/; 
    const match = content.match(regex);
  
    if (match) {
      const command = match[1].slice(1).toLowerCase(); 
      const date = match[2]; 
  
      await commandManager.consultarComando(message, command, date);
    } else {
      const command = content.slice(1).toLowerCase();
      await commandManager.consultarComando(message, command);
    }
  }
});

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});



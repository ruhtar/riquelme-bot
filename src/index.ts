export { client };
  import { TextChannel } from "discord.js";
  import * as dotenv from "dotenv";
  import { replyMessage } from "./conts/commands/commands-reply-messages";
  import { DatabaseInitializer } from "./database/database-initializer";
  import { Repository } from "./database/repository";
  import { CommandManager } from "./managers/command-mananger";
  import { monitorTwitchChannel } from "./managers/twitch-manager";
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
  
  const content = message.content;
  
  if (message.content) {
    var repo = new Repository();
    
    repo.saveUserMessage(message.author.id, message.content);
    
    if(content === "!mensagens"){
      var counter = await repo.getMessagesCounter(message.author.id, );
      replyMessage(message, "mensagens", counter);
      return;
    }
  }
  
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.
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

const channelName = 'amelhorqtemos';

// Variável para armazenar o status atual da live
let wasLive = false; // Armazena o status da live anterior
async function checkLiveStatusPeriodically(channelName: string, interval: number) {
  const channelId = process.env.CHANNEL_ID;

  if (!channelId) {
    console.error('Erro: CHANNEL_ID não configurado nas variáveis de ambiente.');
    return;
  }

  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (!channel) {
    console.error('Erro: Canal do Discord não encontrado.');
    return;
  }

  // Função para enviar mensagem ao canal do Discord
  const sendNotification = (message: string) => {
    channel.send({ content: message }).catch((error) =>
      console.error(`Erro ao enviar mensagem ao Discord: ${error}`)
    );
  };

  // Função para verificar o status da live periodicamente
  const checkStatus = async () => {
    try {
      const isLive = await monitorTwitchChannel(channelName);

      if (isLive && !wasLive) {
        wasLive = true;
        console.log(`A live de ${channelName} começou!`);
        sendNotification(
          `🚨 **RAPAZIADA, A STREAM DE \`${channelName}\` ESTÁ AO VIVO, VALDEZ!** 🚨\n\n🔴 Venham conferir: https://www.twitch.tv/${channelName}`
        );
      } else if (!isLive && wasLive) {
        wasLive = false;
        console.log(`A live de ${channelName} terminou.`);
      } else {
        console.log(`A live de ${channelName} permanece no estado atual: ${isLive ? 'ao vivo' : 'offline'}.`);
      }
    } catch (error) {
      console.error(`Erro ao verificar status da live: ${error}`);
    }
  };

  // Inicia a verificação periódica
  setInterval(checkStatus, interval);
}

const interval = 2 * 60 * 1000; 
checkLiveStatusPeriodically(channelName, interval);

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});
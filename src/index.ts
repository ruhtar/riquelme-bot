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

import ollama from 'ollama';
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
    if (message.mentions.has(client.user!)) {
      // Extrai o conteúdo da mensagem, removendo a menção ao bot
      const userMessage = message.content.replace(`<@${client.user?.id}>`, '').trim();

      // Verifica se a mensagem não está vazia após remover a menção
      if (userMessage) {
          try {
            const mensagem = `Você é um chatbot de Discord que responde comentários de usuários do servidor da maneiras mais humana possível, como se fosse uma conversa de fato. Faça respostas curtas e direto ao ponto. Responda as mensagens sempre em português. Aqui vai o comentário: "${userMessage}"`;

            if (mensagem.trim()){

              const response = await ollama.chat({
                model: 'llama3.2',
                messages: [{ role: 'user', content: mensagem }],
              });
              
              // Envia a resposta de volta ao Discord
              await message.channel.send(response.message.content);
            }
          } catch (error) {
              console.error('Error calling Ollama API:', error);
              await message.channel.send('vou responder não to de greve vsf arthur morte a nossos senhores');
          }
      }
  }


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
let wasLive = false;

function checkLiveStatusPeriodically(channelName: string, interval: number) {
  setInterval(() => {
    monitorTwitchChannel(channelName).then((isLive) => {
      if (isLive && !wasLive) {
        wasLive = true; 
        const channelId = process.env.CHANNEL_ID;
        if (!channelId) return;

        const channel = client.channels.cache.get(channelId);

        if (channel) {
          (channel as TextChannel).send({
            content: `🚨 **RAPAZIADA, A STREAM DE \`${channelName}\` ESTÁ AO VIVO, VALDEZ!** 🚨\n\n🔴 Venham conferir: **[https://www.twitch.tv/${channelName}](https://www.twitch.tv/${channelName})**\n\n`,
          });
        } else {
          console.error('Canal do Discord não encontrado.');
        }
      } 
      else if (!isLive && wasLive) {
        wasLive = false; 
        console.log(`A stream de ${channelName} terminou.`);
      } else {
        // console.log(`A stream de ${channelName} não está ao vivo.`);
      }
    }).catch(error => {
      console.error(`Erro ao verificar live: ${error}`);
    });
  }, interval);
}

const interval = 2 * 60 * 1000; 
checkLiveStatusPeriodically(channelName, interval);

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});
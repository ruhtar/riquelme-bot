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
  if (message.author.id === client.user?.id) return; // Evita que Riquelme responda a si mesmo.

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

// setInterval(() => {
//   console.log("checou")
//   monitorTwitchChannel(channelName);
// }, 60000);

 monitorTwitchChannel(channelName).then((isLive)=>{
  if(isLive){

    const channelId = process.env.CHANNEL_ID;
    if (!channelId ) return;

    const channel = client.channels.cache.get(channelId);

    if (channel) {
      (channel as TextChannel).send({
        content: `🚨 **RAPAZIADA, A STREAM DE \`${channelName}\` ESTÁ AO VIVO, VALDEZ!** 🚨\n\n🔴 Venham conferir: **[Clique aqui para assistir!](https://www.twitch.tv/${channelName})**\n\n`,
    })
    } else {
      console.error('Canal do Discord não encontrado.');
    }
  }else {
    console.log(`A stream de ${channelName} não está ao vivo.`);
  }
 }).catch(error => {
  console.error(`Erro ao verificar live: ${error}`);
});

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});
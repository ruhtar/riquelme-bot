export { client };
  import * as dotenv from "dotenv";
  import OpenAI from "openai";
  import { replyMessage } from "./conts/commands/commands-reply-messages";
  import { DatabaseInitializer } from "./database/database-initializer";
  import { Repository } from "./database/repository";
  import { CommandManager } from "./managers/command-mananger";
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

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

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

  if(content === 'teste'){
    try {
      const response = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: ""
          },
          {
            role: "user",
            content: "Escreva alguma frase específica do cantor riquelme do avioes do forro"
          }
        ]
      });
    
      // Verifica se 'response' e 'choices' estão definidos
      if (response && response.choices && response.choices.length > 0) {
        message.reply(response.choices[0].message.content as string);
      } else {
        // Se por algum motivo não houver resposta
        message.reply("Não consegui entender, tenta de novo mais tarde!");
      }
    
    } catch (error) {
      console.error("ERRO NA OPENAI", error);
      message.reply("Meu querido, fala comigo agora não que eu não to legal blz? Reclama com meu patrão que não paga meu salário");
    }
  }
});

client.on("ready", async () => {
  console.log("Como ja dizia xande do aviões: Burucutugurugudu akstiguiriguidôô")
});
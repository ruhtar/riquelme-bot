import { Message } from "discord.js";
import { DatabaseManager } from "../managers/databaseManager";
import { VoiceTimeManager } from "../managers/voiceTimeManager";
import { counterCommandsList } from "./commandsList";

export class CommandHandler{
    public async handleCommand(message: Message, command: string) {
        if(counterCommandsList.includes(command.toLowerCase())){
            const databaseManager = new DatabaseManager();
            databaseManager.incrementCommandCounter(command);
            var counterObject = await databaseManager.getCommandCounter(command);
            var counter = Object.values(counterObject)[0];
            this.replyMessage(message, command, counter);
        }

        if(command.toLowerCase() === "comandos")
        {
            const listaComandos = counterCommandsList.join("\n");
            message.reply("Tá aqui sua lista de comandos, aviãozeiro:\n" + listaComandos);
        }

        if (command.toLowerCase() === "voice") {
            const voiceTimeManager = new VoiceTimeManager();
            await voiceTimeManager.getTotalTimeInVoice(message);
        }
    }

    private replyMessage(message: Message, command: string, counter: unknown){
        switch (command) {
            case "flau":
                message.reply(`Esse é o ${counter}º corte do Flau Podcast™`)
                break;         
            case "lanchinho":
                message.reply(`Você caiu no lanchinho do victão pela ${counter}º vez.`)
                break;            
            case "safadeza":
                message.reply(`Victor Mateus falou uma safadeza pela ${counter}º vez.`)
                break;
            case "fakenews":
                message.reply(`É A ${counter}º FAKE NEWS QUE PABLO LYRA SOLTA`)
                break;
            case "flash":
                if (counter === 1) 
                    message.reply(`${counter} pessoa teve flash.`)
                else
                    message.reply(`${counter} pessoas já tiveram flash.`)
                break;
            case "darkleo":
                message.reply(`Leossamp entrou no modo dark ${counter} vezes.`)
                break;
            case "laele":
                if (counter === 1) 
                    message.reply(`laele ${counter} vez`)
                else 
                    message.reply(`laele ${counter} vezes`)
                break;
            default:
                break;
        }
    }
}
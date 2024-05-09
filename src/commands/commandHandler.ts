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
            console.log('counter',counter)
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
            case "darkleo":
                message.reply(`Leossamp entrou no modo dark ${counter} vezes.`)
                break;
            default:
                break;
        }
    }
}
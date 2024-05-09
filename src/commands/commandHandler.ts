import { Message } from "discord.js";
import { counterCommandsList } from "../conts/commandsList";
import { replyMessage } from "../conts/commandsMessages";
import { Repository } from "../managers/repository";
import { VoiceTimeManager } from "../managers/voiceTimeManager";

export class CommandHandler{
    public async handleCommand(message: Message, command: string) {
        if(counterCommandsList.includes(command.toLowerCase())){
            const repository = new Repository();
            repository.incrementCommandCounter(command);
            var counterObject = await repository.getCommandCounter(command);
            var counter = Object.values(counterObject)[0];
            replyMessage(message, command, counter);
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


}
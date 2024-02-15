import { Message } from "discord.js";
import { VoiceTimeManager } from "../managers/voiceTimeManager";

export class CommandHandler{
    public async handleCommand(message: Message, command: string) {
        if (command.toLowerCase() === "voice") {
            const voiceTimeManager = new VoiceTimeManager();
            await voiceTimeManager.getTotalTimeInVoice(message);
        }
    }
}
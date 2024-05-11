import { VoiceConnection, VoiceConnectionStatus, createAudioPlayer, entersState, joinVoiceChannel } from '@discordjs/voice';
import { Message, VoiceBasedChannel } from "discord.js";
import { counterCommandsList } from "../conts/commands/commands-list";
import { replyMessage } from "../conts/commands/commands-reply-messages";
import { Repository } from "../database/repository";
import { VoiceTimeManager } from "./voice-time-manager";

export class CommandManager{
    public async handleCommand(message: Message, command: string) {
        if(counterCommandsList.includes(command.toLowerCase())){
            const repository = new Repository();
            repository.incrementCommandCounter(command);
            var counterObject = await repository.getCommandCounter(command);
            var counter = Object.values(counterObject)[0];
            replyMessage(message, command, counter);
            return;
        }

        if (command.toLowerCase() === 'riquelme') {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                return message.reply('Cê tem que estar em um canal de voz pra isso seu cabaço');
            }

            const connection = await this.connectToChannel(voiceChannel)

            const player = createAudioPlayer();

            connection.subscribe(player);
            await message.reply("QUEEEBRAAAA")
            // // subscription could be undefined if the connection is destroyed!
            // if (subscription) {
            //     // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
            //     setTimeout(() => subscription.unsubscribe(), 5_000);
            // }
            
            // if(connection) connection.destroy();
        }

        if(command.toLowerCase() === "comandos"){
            const listaComandos = counterCommandsList.join("\n");
            message.reply("Tá aqui sua lista de comandos, aviãozeiro:\n" + listaComandos);
        }

        if (command.toLowerCase() === "voice") {
            const voiceTimeManager = new VoiceTimeManager();
            await voiceTimeManager.getSelfTotalTimeInVoice(message);
        }
        
        if (/voice <@\d+>/.test(command)) {
            const voiceTimeManager = new VoiceTimeManager();
            const userIdRegex = /<@(\d+)>/;
            const userIdMatch = message.content.match(userIdRegex);
            if (userIdMatch) {
                const userId = userIdMatch[1]; 
                console.log("User ID:", userId);
                await voiceTimeManager.getUserTotalTimeInVoice(message, userId);
            }
        }
    }
    private async connectToChannel(channel: VoiceBasedChannel): Promise<VoiceConnection>{
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
    
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            return connection;
        } catch (error) {
            connection.destroy();
            throw error;
        }
    }

}



import {
    AudioPlayer, AudioPlayerStatus, StreamType, VoiceConnection,
    VoiceConnectionStatus, createAudioPlayer, createAudioResource,
    entersState, joinVoiceChannel
} from '@discordjs/voice';
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
            try {
                console.log('Song is ready to play!');
                this.playSong(player);
            } catch (error) {
                /**
                 * The song isn't ready to play for some reason :(
                 */
                console.error(error);
            }finally{
                // if(connection) connection.destroy();
            }
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

    private async playSong(player: AudioPlayer) {
        /**
         * Here we are creating an audio resource using a sample song freely available online
         * (see https://www.soundhelix.com/audio-examples)
         *
         * We specify an arbitrary inputType. This means that we aren't too sure what the format of
         * the input is, and that we'd like to have this converted into a format we can use. If we
         * were using an Ogg or WebM source, then we could change this value. However, for now we
         * will leave this as arbitrary.
         */
        const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
            inputType: StreamType.Arbitrary,
        });
    
        /**
         * We will now play this to the audio player. By default, the audio player will not play until
         * at least one voice connection is subscribed to it, so it is fine to attach our resource to the
         * audio player this early.
         */
        player.play(resource);
    
        /**
         * Here we are using a helper function. It will resolve if the player enters the Playing
         * state within 5 seconds, otherwise it will reject with an error.
         */
        return entersState(player, AudioPlayerStatus.Playing, 5000);
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



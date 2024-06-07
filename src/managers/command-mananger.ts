import {
    AudioPlayer, AudioPlayerStatus, StreamType, VoiceConnection,
    VoiceConnectionStatus, createAudioPlayer, createAudioResource,
    entersState, joinVoiceChannel
} from '@discordjs/voice';
import { Message, VoiceBasedChannel } from "discord.js";
import ytdl from 'ytdl-core';
import { counterCommandsList } from "../conts/commands/commands-list";
import { replyMessage } from "../conts/commands/commands-reply-messages";
import { getRandomUrl } from '../conts/videos/videos-list';
import { Repository } from "../database/repository";
import { VoiceTimeManager } from "./voice-time-manager";

export class CommandManager {
    public async consultarComando(message: Message, command: string, data: string= ""){
        if (counterCommandsList.includes(command.toLowerCase())) {
            const repository = new Repository();
            var counter = await repository.getCommandCounter(command, "", data);
            replyMessage(message, command, counter);
            return;
        }
    }

    public async handleCommand(message: Message, command: string, data: string= "") {
        if (counterCommandsList.includes(command.toLowerCase())) {
            const repository = new Repository();
            repository.insertCommand(command, message.author.id);
            var counter = await repository.getCommandCounter(command, "", data);
            replyMessage(message, command, counter);
            return;
        }

        if (command.toLowerCase() === 'riquelme') {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                return message.reply('Cê tem que tá em um canal de voz pra isso seu cabaço');
            }
            try {
                const connection = await this.connectToChannel(voiceChannel)
                const player = createAudioPlayer();

                connection.subscribe(player);
                await message.reply("QUEEEEEEEEEEBRAAAAAAA")

                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });

                this.playSong(player, getRandomUrl());
            } catch (error) {
                console.error(error);
            }
        }

        if (command.toLowerCase() === "comandos") {
            const listaComandos = counterCommandsList.join("\n");
            message.reply("Tá aqui sua lista de comandos, aviãozeiro:\n" + "\n" + listaComandos);
        }

        if (command.toLowerCase() === "voice") {
            const voiceTimeManager = new VoiceTimeManager();
            if(data){
                await voiceTimeManager.getSelfTotalTimeInVoice(message, data);

            }else{
                await voiceTimeManager.getSelfTotalTimeInVoice(message);
            }
        }

        if (/voice <@\d+>/.test(command)) {
            const voiceTimeManager = new VoiceTimeManager();
            const userIdRegex = /<@(\d+)>/;
            const userIdMatch = message.content.match(userIdRegex);
            if (userIdMatch) {
                const userId = userIdMatch[1];
                await voiceTimeManager.getUserTotalTimeInVoice(message, userId);
            }
        }
    }

    private async playSong(player: AudioPlayer, url: string) {
        /**
         * Here we are creating an audio resource using a sample song freely available online
         * (see https://www.soundhelix.com/audio-examples)
         *
         * We specify an arbitrary inputType. This means that we aren't too sure what the format of
         * the input is, and that we'd like to have this converted into a format we can use. If we
         * were using an Ogg or WebM source, then we could change this value. However, for now we
         * will leave this as arbitrary.
         */
        const stream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25 // Aumenta o buffer de água para evitar interrupções
        });


        const resource = createAudioResource(stream, {
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

    private async connectToChannel(channel: VoiceBasedChannel): Promise<VoiceConnection> {
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



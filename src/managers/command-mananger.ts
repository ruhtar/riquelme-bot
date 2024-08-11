import {
    AudioPlayer, AudioPlayerStatus, StreamType, VoiceConnection,
    VoiceConnectionStatus, createAudioPlayer, createAudioResource,
    entersState, joinVoiceChannel
} from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import { Message, VoiceBasedChannel } from "discord.js";
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Readable } from 'stream';
import { counterCommandsList } from "../conts/commands/commands-list";
import { replyMessage } from "../conts/commands/commands-reply-messages";
import { getRandomUrl } from '../conts/videos/videos-list';
import { Repository } from "../database/repository";
import { generateReport } from './report-manager';
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

                this.playSong(player, getRandomUrl(), message);
            } catch (error) {
                console.log('AVIÃOZEIRO!!!!!! DEU PANE AQUI:',error)
                await message.reply("AVIÃOZEIRO, DEU ALGUMA PANE AQUI. VOU FICAR TE DEVENDO")
            }
        }

        if (command.toLowerCase() === "comandos") {
            const listaComandos = counterCommandsList.map(command => `\`${command}\``).join("\n");
            message.reply("**Tá aqui sua lista de comandos, aviãozeiro:**\n" + "\n" + listaComandos);
        }

        if (command.toLowerCase() === "voice") {
            const voiceTimeManager = new VoiceTimeManager();
            if(data){
                await voiceTimeManager.getSelfTotalTimeInVoice(message, data);
            }else{
                await voiceTimeManager.getSelfTotalTimeInVoice(message);
            }
        }

        if (command.toLowerCase() === "report"){
            generateReport();
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

    private async playSong(player: AudioPlayer, url: string, message: Message<boolean>) {
        console.log('url sorteada: ',url)

        try {
        // Stream do youtube com ytdl-core
        const stream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25 // Aumenta o buffer de água para evitar interrupções
        });
    
        // Use FFmpeg to normalize the audio volume
        if (ffmpegPath === null)
            return;

        const passThroughStream = new PassThrough();

        ffmpeg(stream)
        .setFfmpegPath(ffmpegPath)
        .audioFilter('loudnorm') // Normalize volume using loudnorm filter
        .format('mp3')
        .pipe(passThroughStream);

        const normalizedStream: Readable = passThroughStream;
    
        const resource = createAudioResource(normalizedStream, {
            inputType: StreamType.Arbitrary,
        });
    
        player.play(resource);
    
        return entersState(player, AudioPlayerStatus.Playing, 5000);
        } catch (error) {
            console.log('AVIÃOZEIRO!!!!!! DEU PANE AQUI:',error)
            await message.reply("AVIÃOZEIRO, DEU ALGUMA PANE AQUI. VOU FICAR TE DEVENDO")
        }
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

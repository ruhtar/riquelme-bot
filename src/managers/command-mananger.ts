import {
    AudioPlayerStatus, StreamType, VoiceConnection,
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

const respondWithCommandList = async (message: Message) => {
    const listaComandos = counterCommandsList.map(cmd => `\`${cmd}\``).join("\n");
    await message.reply("**Tá aqui sua lista de comandos, aviãozeiro:**\n" + "\n" + listaComandos);
};

const getProcessedAudioStream = async (url: string): Promise<Readable> => {
    const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    });

    const passThroughStream = new PassThrough();

    if (ffmpegPath === null) throw new Error('FFmpeg path is not set.');

    ffmpeg(stream)
        .setFfmpegPath(ffmpegPath)
        .audioFilter('loudnorm')
        .format('mp3')
        .pipe(passThroughStream)

    return passThroughStream;
};

const connectToVoiceChannel = async (channel: VoiceBasedChannel): Promise<VoiceConnection> => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        console.log('deu um erro na hora de conectar ao voice meu chapa',error)
        connection.destroy();
        throw error;
    }
};

export class CommandManager {
    public async getCommandCounter(message: Message, command: string, data: string = "") {
        if (counterCommandsList.includes(command.toLowerCase())) {
            const repository = new Repository();
            const counter = await repository.getCommandCounter(command, "", data);
            replyMessage(message, command, counter);
        }
    }

    public async handleCommand(message: Message, command: string, data: string = "") {
        const lowerCommand = command.toLowerCase();

        if (counterCommandsList.includes(lowerCommand)) {
            await this.handleCounterCommand(message, lowerCommand, data);
        } else if (lowerCommand === 'riquelme') {
            await this.handleRiquelmeCommand(message);
        } else if (lowerCommand === 'comandos') {
            await respondWithCommandList(message);
        } else if (lowerCommand === 'voice') {
            await this.handleVoiceCommand(message, data);
        } else if (lowerCommand === 'report') {
            generateReport();
        } else if (/voice <@\d+>/.test(command)) {
            await this.handleVoiceMentionCommand(message, command);
        }
    }

    private async handleCounterCommand(message: Message, command: string, data: string) {
        const repository = new Repository();
        repository.insertCommand(command, message.author.id);
        const counter = await repository.getCommandCounter(command, "", data);
        replyMessage(message, command, counter);
    }

    private async handleRiquelmeCommand(message: Message) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
            await message.reply('Cê tem que tá em um canal de voz pra isso seu cabaço');
            return;
        }

        try {
            const connection = await connectToVoiceChannel(voiceChannel);
            const player = createAudioPlayer();
            connection.subscribe(player);

            await message.reply("BURUCUTUGURUGUDU AKSTIGUIRIGUIDÔÔ");

            player.on(AudioPlayerStatus.Idle, () => connection.destroy());

            const url = getRandomUrl();
            const audioStream = await getProcessedAudioStream(url);
            const resource = createAudioResource(audioStream, { inputType: StreamType.Arbitrary });

            player.play(resource);
            await entersState(player, AudioPlayerStatus.Playing, 5000);
        } catch (error) {
            console.error('AVIÃOZEIRO!!!!!! DEU PANE AQUI:', error);
            await message.reply("AVIÃOZEIRO, DEU ALGUMA PANE AQUI. VOU FICAR TE DEVENDO");
        }
    }

    private async handleVoiceCommand(message: Message, data: string) {
        const voiceTimeManager = new VoiceTimeManager();
        data ? await voiceTimeManager.getSelfTotalTimeInVoice(message, data) : await voiceTimeManager.getSelfTotalTimeInVoice(message);
    }

    private async handleVoiceMentionCommand(message: Message, command: string) {
        const userIdRegex = /<@(\d+)>/;
        const userIdMatch = message.content.match(userIdRegex);
        if (userIdMatch) {
            const userId = userIdMatch[1];
            const voiceTimeManager = new VoiceTimeManager();
            await voiceTimeManager.getUserTotalTimeInVoice(message, userId);
        }
    }
}
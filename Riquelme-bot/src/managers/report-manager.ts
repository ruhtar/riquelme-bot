import { Guild, TextChannel } from "discord.js";
import { client } from "..";
import { Repository } from "../database/repository";
import { CommandCount, UserActiveReport } from "../structs/types/DataTypes";
import { getCurrentMonthName, getPreviousMonthAndYear } from "../utils/month-functions";
const { GuildMember } = require('discord.js');

export const generateReport = async () => {
    try {
        const channelId = process.env.CHANNEL_ID;
        const guildId = process.env.GUILD_ID;

        if (!channelId || !guildId) return;

        const channel = client.channels.cache.get(channelId);
        const guild =  client.guilds.cache.get(guildId);

        if (!channel || !guild) return;

        let repo = new Repository()

        const relatorioComandosMesAtual: CommandCount[] = await repo.getTopCommandsByMonthAndYear(getPreviousMonthAndYear());

        const relatorioComandosTotal: CommandCount[] = await repo.getTopCommandsByMonthAndYear();

        const relatorioUsuariosMaisAtivos: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear(getPreviousMonthAndYear());

        const relatorioUsuariosTotalMaisAtivos: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear();

        const relatorioUsuariosMenosAtivos: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear(getPreviousMonthAndYear(), false);

        const relatorioUsuariosTotalMenosAtivos: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear(null, false);

        const mensagem = `# 📊📆🎉 ** EAÍ, SEUS NERDS. BEM VINDOS AO RELATÓRIO MENSAL DE ${getCurrentMonthName().toUpperCase()}!🎮🏳️‍🌈**


**Usuários mais ativos no mês:**
${formatUserActivity(relatorioUsuariosMaisAtivos, guild, ["🥇", "🥈", "🥉","🏅","🎖️"])}

**Usuários menos ativos no mês:**
${formatUserActivity(relatorioUsuariosMenosAtivos, guild, ["💩", "🤡", "🤮", "🚽", "🗑️"])}

**Comandos mais utilizados no mês**
${formatCommandUsage(relatorioComandosMesAtual, ["🥇", "🥈", "🥉","🏅","🎖️"])}

**Usuários mais ativos no total:**
${formatUserActivity(relatorioUsuariosTotalMaisAtivos, guild, ["🥇", "🥈", "🥉","🏅","🎖️"])}

**Usuários menos ativos no total:**
${formatUserActivity(relatorioUsuariosTotalMenosAtivos, guild, ["💩", "🤡", "🤮", "🚽", "🗑️"])}

**Comandos mais utilizados até hoje:**
${formatCommandUsage(relatorioComandosTotal, ["🥇", "🥈", "🥉","🏅","🎖️"])}`;

        (channel as TextChannel).send({
            content: mensagem,
        })
            .catch(err => {
                console.error(err);
            });
    } catch (error) {
        console.log('error', error)
    }
};

const getUserDisplayName = (userId: string, guild: Guild): string => {
    const member = guild.members.cache.get(userId);
    return member?.displayName || "Nerd desconhecido";
};

const formatTime = (totalTime: number): string => {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = totalTime % 60;
    return `${hours}h ${minutes}min ${seconds}segs`;
};

const formatUserActivity = (relatorio: UserActiveReport[], guild: Guild, medals: string[]): string => {
    return relatorio.map((item, index) => {
        const nome = getUserDisplayName(item.user_id, guild);
        const timeFormatted = formatTime(item.totalTime);
        const medalha = medals[index] || medals[medals.length - 1];
        return `${medalha} ${index + 1}. ${nome} - Tempo Ativo: ${timeFormatted}`;
    }).join('\n');
};

const formatCommandUsage = (relatorio: CommandCount[], medals: string[]): string => {
    return relatorio.map((item, index) => {
        const medalha = medals[index] || medals[medals.length - 1];
        return `${medalha} ${index + 1}. ${item.command} - Vezes usado: ${item.count}`;
    }).join('\n');
};

import { TextChannel } from "discord.js";
import { client } from "..";
import { CommandCount, Repository, UserActiveReport } from "../database/repository";
import { getCurrentMonthAndYear, getCurrentMonthName } from "../utils/actual-month";
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

        const relatorioComandosMesAtual: CommandCount[] = await repo.getTopCommandsByMonthAndYear(getCurrentMonthAndYear());

        const relatorioComandosTotal: CommandCount[] = await repo.getTopCommandsByMonthAndYear();

        const relatorioUsuarios: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear(getCurrentMonthAndYear());

        const relatorioUsuariosTotal: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear();

        const mensagem = `# 📊📆🎉 **BEM VINDOS AO RELATÓRIO MENSAL DE ${getCurrentMonthName().toUpperCase()}!🎮🏳️‍🌈**

**Usuários mais ativos no mês:**

${relatorioUsuarios.map((item, index) => {
    const member = guild.members.cache.get(item.user_id);
    let nome = member?.displayName
    if(!nome) nome = "Nerd desconhecido"
    const hours = Math.floor(item.totalTime / 3600);
    const minutes = Math.floor((item.totalTime % 3600) / 60);
    const seconds = item.totalTime % 60;
    let medalha = "🥉";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    return `${medalha} ${index + 1}. ${nome} - Tempo Ativo: ${hours}h ${minutes}min ${seconds}segs`;
}).join('\n')}

**Comandos mais utilizados no mês**

${relatorioComandosMesAtual.map((item, index) => {
    let medalha = "🥉";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    return `${medalha} ${index + 1}. ${item.command} - Vezes usado: ${item.count}`;
}).join('\n')}

**Usuários mais ativos no total:**

${relatorioUsuariosTotal.map((item, index) => {
    const member = guild.members.cache.get(item.user_id);
    let nome = member?.displayName
    if(!nome) nome = "Nerd desconhecido"
    const hours = Math.floor(item.totalTime / 3600);
    const minutes = Math.floor((item.totalTime % 3600) / 60);
    const seconds = item.totalTime % 60;
    let medalha = "🥉";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    return `${medalha} ${index + 1}. ${nome} - Tempo Ativo: ${hours}h ${minutes}min ${seconds}segs`;
}).join('\n')}

**Comandos mais utilizados até hoje:**

${relatorioComandosTotal.map((item, index) => {
    let medalha = "🥉";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    return `${medalha} ${index + 1}. ${item.command} - Vezes usado: ${item.count}`;
}).join('\n')}
`;

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

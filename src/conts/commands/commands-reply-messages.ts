import { Message } from "discord.js";
export const replyMessage = (message: Message, command: string, counter: unknown) => {
    const responseMap = new Map<string, string>([
        ["arroto", `**${counter} argômitos e subindo**`],
        ["putaria", `**JÁ FALARAM ${counter} PUTARIAS UUIIIIIIIIIIIIIIIIIIIIIIIIII SEXOOOOOOOOOOOOOOOO**`],
        ["quorum", `hj n teve quorum :( dia n°${counter}`],
        ["fantasma", `*Parece que mais uma pessoa foi assolada pelo fantasma do hardware. Agora são: ${counter}*`],
        ["overheat", `Já foram ${counter} jogos churrascados pelo overheat.`],
        ["minorias", `${counter} minorias já foram ofendidas`],
        ["flau", `Esse é o \`${counter}º corte do Flau Podcast™\``],
        ["saidinha", `Você caiu na saidinha do Victão pela ${counter}º vez.`],
        ["safadeza", `Victor Mateus falou uma safadeza pela ${counter}º vez.`],
        ["fakenews", `É A ${counter}º FAKE NEWS QUE PABLO LYRA SOLTA`],
        ["darkleo", `\`Leossamp entrou no modo dark ${counter} vezes.\``],
        ["laele", `**laele ${counter} vezes**`],
        ["flash", `**Augusto já reclamou que todo mundo tem flash ${counter} vezes**`],
    ]);

    const response = responseMap.get(command);
    if (response) message.reply(response);
};
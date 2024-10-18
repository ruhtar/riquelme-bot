import { Message } from "discord.js";
export const replyMessage = (message: Message, command: string, counter: unknown) => {
    const responseMap = new Map<string, string>([
        ["arroto", `**${counter} argômitos e subindo**`],
        ["putaria", `**JÁ FALARAM ${counter} PUTARIAS, MIZERÁÁÁVI! SEXOOOOOOOOO, AVIÕES PRA CIMA!**`],
        ["quorum", `NÃO FOI HOJE QUE TEVE QUÓRUM, AVIÕES! DIA NÚMERO ${counter} QUE NÓS NÃO CONSEGUIMOS!`],
        ["fantasma", `*Ó o fantasma do hardware, mais um foi pego, já são ${counter}, meu amigo... bora resolver isso aí!*`],
        ["overheat", `Já foram ${counter} jogos churrascados pelo overheat.`],
        ["minorias", `${counter} minorias já foram ofendidas`],
        ["flau", `Esse é o \`${counter}º corte do Flau Podcast™\``],
        ["saidinha", `SAI! SAI! SAI! Você caiu na saidinha pela ${counter}º vez.`],
        ["safadeza", `Victor Mateus falou uma safadeza pela ${counter}º vez.`],
        ["fakenews", `É A ${counter}º FAKE NEWS QUE SOLTAM NESSA PORRA! VÃO SE INFORMAR!`],
        ["darkleo", `\`Leossamp entrou no modo dark ${counter} vezes.\``],
        ["laele", `**laeleeee ${counter} vezes!**`],
        ["flash", `**Augusto já reclamou que todo mundo tem flash ${counter} vezes**`],
        ["vitoria", `**GANHAMO ${counter} JOGOS NESSA PORRA. SEM MEDOO. PRA CIMA**`],
        ["derrota", `\`perdemo. tem dia que é noite. E foram ${counter} noites.\``],
        ["ace", `TÁ NA CONTAGEM DOS \`PAMBAMPAMBAMS\`, SÃO ${counter}, TÁ VALENDO! VAMO PRA CIMA!`],
        ["smurf", `Promessa de Prata™ número ${counter}`],
        ["mensagens", `Você já mandou ${counter} mensagens! Fala muito, filho! Diminui o ritmo!`]
    ]);

    const response = responseMap.get(command);
    if (response) message.reply(response);
};
import { Message } from "discord.js";
export const replyMessage = (message: Message, command: string, counter: unknown) => {
    const responseMap = new Map<string, string>([
        ["arroto", `**${counter} argômitos e subindo**`],
        ["putaria", `**JÁ FALARAM ${counter} PUTARIAS SEXOOOOOOOOO**`],
        ["quorum", `NÃO FOI HOJE QUE TEVE QUÓRUM, AVIÕES! DIA NÚMERO ${counter} QUE NÓS NÃO CONSEGUIMOS!`],
        ["fantasma", `*Ó o fantasma do hardware 👻. Já são ${counter}, meu amigo...*`],
        ["overheat", `Já foram ${counter} jogos churrascados pelo overheat.`],
        ["minorias", `${counter} minorias já foram ofendidas. Vamo melhorar ai familia`],
        ["flau", `Esse é o \`${counter}º corte do Flau Podcast™\``],
        ["saidinha", `Você caiu numa saidinha pela ${counter}º vez.`],
        ["safadeza", `Falaram uma safadeza pela ${counter}º vez.`],
        ["fakenews", `É A ${counter}º FAKE NEWS QUE SOLTAM NESSA PORRA! VÃO SE INFORMAR!`],
        ["darkleo", `\`Leossamp entrou no modo dark ${counter} vezes.\``],
        ["laele", `**laeleeee ${counter} vezes!**`],
        ["flash", `**Augusto já reclamou que todo mundo tem flash ${counter} vezes**`],
        ["vitoria", `**GANHAMO ${counter} JOGOS NESSA PORRA. SEM MEDOOOOOO. PRA CIMA**`],
        ["derrota", `\`perdemo. tem dia que é noite. E foram ${counter} noites.\``],
        ["ace", `TÁ NA CONTAGEM DOS \`PAMBAMPAMBAMS\`, SÃO ${counter}, TÁ VALENDO! VAMO PRA CIMA!`],
        ["smurf", `Achamos a Promessa do Prata™ número ${counter}`],
        ["mensagens", `Você já mandou ${counter} mensagens! Fala muito, filho! Diminui o ritmo!`]
    ]);

    const response = responseMap.get(command);
    if (response) message.reply(response);
};
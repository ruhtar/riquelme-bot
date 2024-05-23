import { Message } from "discord.js";

export const replyMessage = (message: Message, command: string, counter: unknown) => {
    switch (command) {
        case "arroto":
            message.reply(`${counter} argômitos e subindo`)
            break;  
        case "putaria":
            message.reply(`JÁ FALARAM ${counter} PUTARIAS UUIIIIIIIIIIIIIIIIIIIIIIIIII SEXOOOOOOOOOOOOOOOO`)
            break;  
        case "quorum":
            message.reply(`hj n teve quorum :( dia n°${counter}`)
            break;  
        case "fantasma":
            message.reply(`Parece que mais uma pessoa foi assolada pelo fantasma do hardware. Agora são: ${counter}`)
            break;  
        case "overheat":
            message.reply(`Já foram ${counter} jogos churrascados em overheat.`)
            break;  
        case "minorias":
            message.reply(`${counter} minorias já foram ofendidas`)
            break;     
        case "flau":
            message.reply(`Esse é o ${counter}º corte do Flau Podcast™`)
            break;         
        case "lanchinho":
            message.reply(`Você caiu no lanchinho do victão pela ${counter}º vez.`)
            break;            
        case "safadeza":
            message.reply(`Victor Mateus falou uma safadeza pela ${counter}º vez.`)
            break;
        case "fakenews":
            message.reply(`É A ${counter}º FAKE NEWS QUE PABLO LYRA SOLTA`)
            break;
        case "flash":
            if (counter === 1) 
                message.reply(`${counter} pessoa teve flash.`)
            else
                message.reply(`${counter} pessoas já tiveram flash.`)
            break;
        case "darkleo":
            message.reply(`Leossamp entrou no modo dark ${counter} vezes.`)
            break;
        case "laele":
            if (counter === 1) 
                message.reply(`laele ${counter} vez`)
            else 
                message.reply(`laele ${counter} vezes`)
            break;
        default:
            break;
    }
}
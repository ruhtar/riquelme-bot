import { TextChannel } from "discord.js";
import { client } from "..";
import { parabens } from "../conts/birthday/birthday-reply-messages";
import { birthdays } from "../conts/birthday/birthdays-list";

export const checkBirthday = () => {
    const hoje: Date = new Date();
    const dia: number = hoje.getDate();
    const mes: number = hoje.getMonth() + 1; // Lembrando que o mês é base 0 (janeiro é 0)
    const dataHoje: string = `${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    
    for (const pessoa in birthdays) {
        if (birthdays[pessoa] === dataHoje) {
            const channelId = process.env.CHANNEL_ID;
  
            if(!channelId) return;
  
            const channel = client.channels.cache.get(channelId);
  
            if(!channel) return;
  
            const randomIndex = Math.floor(Math.random() * parabens.length);
            const mensagemAleatoria = parabens[randomIndex];

            (channel as TextChannel).send({
            content: `# 🎉🌟🥳🎈 **Hoje é aniversário de ${pessoa}!** 🎂🎊🎁 **Parabéns!** 🎉🥳🌟🎈`,
            // Você pode adicionar mais formatação ou emojis animados aqui
            })
            .catch(err => { 
            console.error(err);
            });
  
            (channel as TextChannel).send({ content: mensagemAleatoria })
            .catch(err => { 
              console.error(err);
            });
        }
    }
  }
  
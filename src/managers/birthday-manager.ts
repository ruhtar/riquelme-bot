import { TextChannel } from "discord.js";
import { client } from "..";
import { parabens } from "../conts/birthday/birthday-reply-messages";
import { birthdays } from "../conts/birthday/birthdays-list";
import { getCurrentMonthAndYear } from "../utils/month-functions";

export const checkBirthday = () => {
  for (const pessoa in birthdays) {
    if (birthdays[pessoa] ===  getCurrentMonthAndYear()) {
      const channelId = process.env.CHANNEL_ID;

      if (!channelId) return;

      const channel = client.channels.cache.get(channelId);

      if (!channel) return;

      (channel as TextChannel).send({
        content: `# 🎉🌟🥳🎈 **Hoje é aniversário de ${pessoa}!** 🎂🎊🎁 **Parabéns!** 🎉🥳🌟🎈`,
      })
        .catch(err => {
          console.error(err);
        });

      const randomIndex = Math.floor(Math.random() * parabens.length);
      const mensagemAleatoria = parabens[randomIndex];

      (channel as TextChannel).send({
        content: mensagemAleatoria
      })
        .catch(err => {
          console.error(err);
        });
    }
  }
}

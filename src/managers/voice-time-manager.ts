import { Message, VoiceState } from "discord.js";
import { client, repo } from "..";
import { Repository } from "../database/repository";

export class VoiceTimeManager {
  private startTimePerUser = new Map<string, number>();

  public async getUserTotalTimeInVoice(message: Message, userId: string) {
    const totalTime = await repo.getUsersTimeInVoiceByDate(userId);
    const user = client.users.cache.find((user) => user.id === userId);
    if (!user) return;
    const userDisplayName = user.displayName;

    this.replyTotalTimeMessage(totalTime, message, userDisplayName);
  }

  public async getSelfTotalTimeInVoice(message: Message, data: string = "") {
    const userId = message.author.id;
    let totalTime : number | null;

    if(data){
      totalTime = await repo.getUsersTimeInVoiceByDate(userId, data)
    }else{
      totalTime = await repo.getUsersTimeInVoiceByDate(userId)
    }

    this.replyTotalTimeMessage(totalTime, message, message.author.displayName);
  }

  private replyTotalTimeMessage(totalTime: number | null, message: Message, displayName: string) {
    if (!totalTime) {
      message.reply(`${displayName} passou um total de 0 horas, 0 minutos e 0 segundos em chamadas de voz.`);
      return;
    }

    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = totalTime % 60;

    message.reply(`${displayName} passou um total de ${hours} horas, ${minutes} minutos e ${seconds} segundos em chamadas de voz.`);
  }

  public async CountUsersTimeOnVoice(oldState: VoiceState, newState: VoiceState) {
    const member = oldState.member || newState.member;
    const userId = member?.id;
    const repository = new Repository();
    const userJoinedAChannel = newState.channel && userId && !oldState.channel;

    if (userJoinedAChannel) {
      console.log(`${member.displayName} entrou em um canal`);
      this.startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
    }

    const userDisconectedFromChannel = oldState.channel && userId && !newState.channel;

    if (userDisconectedFromChannel) {
      console.log(`${member.displayName} saiu do canal`);

      const endTime = Math.floor(Date.now() / 1000); // Converting to seconds

      let startTime = this.startTimePerUser.get(userId);

      if (!startTime) 
        startTime = Math.floor(Date.now() / 1000);

      const timeInVoiceToAdd = endTime - startTime;

      if (!timeInVoiceToAdd) return;

      repository.saveTotalVoiceTimeToDatabase(userId, timeInVoiceToAdd);

      this.startTimePerUser.set(userId, 0); //reset
    }
  }
}
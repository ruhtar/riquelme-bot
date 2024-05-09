import { Message, VoiceState } from "discord.js";
import { Repository } from "../database/repository";

export class VoiceTimeManager {
    private startTimePerUser = new Map<string, number>();

    public async getTotalTimeInVoice(message: Message){
      const userId = message.author.id;
      const repository = new Repository();
      const totalTime = await repository.getTimeInVoiceByUserId(userId);

      if(!totalTime) {
        message.reply(`Você passou um total de 0 horas, 0 minutos e 0 segundos em chamadas de voz.`);
        return;
      }

      const hours = Math.floor(totalTime / 3600);
      const minutes = Math.floor((totalTime % 3600) / 60);
      const seconds = totalTime % 60;

      message.reply(`Você passou um total de ${hours} horas, ${minutes} minutos e ${seconds} segundos em chamadas de voz.`);
    }

    public async CountUsersTimeOnVoice(oldState: VoiceState, newState: VoiceState){
        const member = oldState.member || newState.member;
        const userId = member?.id;
        const repository = new Repository();
      
        if (newState.channel && userId && !oldState.channel) {
          // Entrou em um canal
          console.log("Entrou em um canal");
      
          this.startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
          const totalTime = await repository.getTimeInVoiceByUserId(userId)
          if (!totalTime) { 
            // Se o usuário não estava em um canal antes, inicializa o tempo
            // TODO: Alterar para que ele puxe do SQLite o tempo ao inves de ficar guardando em memória. 
            // this.voiceTime.set(userId, 0);
            repository.saveTotalVoiceTimeToDatabase(userId, 0)
          }
        }
      
        if (oldState.channel && userId && !newState.channel) {
          // Saiu de um canal
          console.log("Saiu do canal");
          
          const endTime = Math.floor(Date.now() / 1000); // Converte para segundos
          //   let startTime = await databaseManager.getVoiceTimeByUserId(userId);
          let startTime = this.startTimePerUser.get(userId);
          if(!startTime){
            // databaseManager.saveToDatabase(userId, 0)
            startTime = Math.floor(Date.now() / 1000);
          }
      
          const timeInVoiceToAdd = endTime - startTime;
          if(!timeInVoiceToAdd) return;
      
          const oldVoiceTime =  await repository.getTimeInVoiceByUserId(userId);
      
          const newVoiceTime = oldVoiceTime! + timeInVoiceToAdd;
          
          repository.saveTotalVoiceTimeToDatabase(userId, newVoiceTime);
          this.startTimePerUser.set(userId, 0); //reset
        }
    }
}
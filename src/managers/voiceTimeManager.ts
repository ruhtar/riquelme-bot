import { Message, VoiceState } from "discord.js";
import { DatabaseManager } from "./databaseManager";

export class VoiceTimeManager {
    private startTimePerUser = new Map<string, number>();
    private voiceTime = new Map<string, number>();

    public async handleCommand(message: Message, command: string) {
        if (command.toLowerCase() === "voice") {
            const userId = message.author.id;
            const totalTime = this.voiceTime.get(userId) || 0;

            const hours = Math.floor(totalTime / 3600);
            const minutes = Math.floor((totalTime % 3600) / 60);
            const seconds = totalTime % 60;

            message.reply(`Você passou um total de ${hours} horas, ${minutes} minutos e ${seconds} segundos em chamadas de voz.`);
        }
    }

    public async CountUsersTimeOnVoice(oldState: VoiceState, newState: VoiceState){
        const member = oldState.member || newState.member;
        const userId = member?.id;
        const databaseManager = new DatabaseManager();
      
        if (newState.channel && userId && !oldState.channel) {
          // Entrou em um canal
          console.log("Entrou em um canal");
      
          this.startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
          const totalTime = await databaseManager.getVoiceTimeByUserId(userId)
          console.log('totalTime buscado do banco',totalTime)
          if (!totalTime) { //this.voiceTime.has(userId)
            // Se o usuário não estava em um canal antes, inicializa o tempo
            // TODO: Alterar para que ele puxe do SQLite o tempo ao inves de ficar guardando em memória. 
            // this.voiceTime.set(userId, 0);
            console.log("salvou 0 no banco pq foi a primeira vez")
            databaseManager.saveToDatabase(userId, 0)
            console.log('databaseManager.getVoiceTimeByUserId(userId)',await databaseManager.getVoiceTimeByUserId(userId))
          }
        }
      
        if (oldState.channel && userId && !newState.channel) {
          // Saiu de um canal
          console.log("Saiu do canal");
          
          const endTime = Math.floor(Date.now() / 1000); // Converte para segundos
        //   let startTime = await databaseManager.getVoiceTimeByUserId(userId);
          let startTime = this.startTimePerUser.get(userId);
          console.log('startTime pego do Map',startTime)
          if(!startTime){
            // databaseManager.saveToDatabase(userId, 0)
            startTime = Math.floor(Date.now() / 1000);
          }
      
          const timeInVoiceToAdd = endTime - startTime;
          console.log('timeInVoiceToAdd', timeInVoiceToAdd);
          if(!timeInVoiceToAdd) return;
      
          const oldVoiceTime =  await databaseManager.getVoiceTimeByUserId(userId);
          console.log('oldVoiceTime', oldVoiceTime);
      
          const newVoiceTime = oldVoiceTime! + timeInVoiceToAdd;
          console.log("setou", newVoiceTime);
      
          this.voiceTime.set(userId, newVoiceTime);
          
          console.log('newVoiceTime salvo no banco',newVoiceTime)
          databaseManager.saveToDatabase(userId, newVoiceTime);
          this.startTimePerUser.set(userId, 0); //reset
        }
        console.log("voiceTime", this.voiceTime.get(userId!));
        console.log("salvo no banco", await databaseManager.getVoiceTimeByUserId(userId!));
    }


}
import { Message, VoiceState } from "discord.js";
import { DatabaseManager } from "./databaseManager";

export class VoiceTimeManager {
    private startTimePerUser = new Map<string, number>();

    public async handleCommand(message: Message, command: string) {
        if (command.toLowerCase() === "voice") {
            const userId = message.author.id;
            const databaseManager = new DatabaseManager();
            const totalTime = await databaseManager.getTimeInVoiceByUserId(userId);
            console.log('totalTime',totalTime)

            if(!totalTime) return;
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
          const totalTime = await databaseManager.getTimeInVoiceByUserId(userId)
          if (!totalTime) { 
            // Se o usuário não estava em um canal antes, inicializa o tempo
            // TODO: Alterar para que ele puxe do SQLite o tempo ao inves de ficar guardando em memória. 
            // this.voiceTime.set(userId, 0);
            databaseManager.saveToDatabase(userId, 0)
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
      
          const oldVoiceTime =  await databaseManager.getTimeInVoiceByUserId(userId);
      
          const newVoiceTime = oldVoiceTime! + timeInVoiceToAdd;
          
          databaseManager.saveToDatabase(userId, newVoiceTime);
          this.startTimePerUser.set(userId, 0); //reset
        }
    }
}
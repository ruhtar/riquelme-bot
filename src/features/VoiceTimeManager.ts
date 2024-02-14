import { VoiceState } from "discord.js";

export class VoiceTimeManager{
    private startTimePerUser = new Map<string, number>();
    private voiceTime = new Map<string, number>();

    public CountUsersTimeOnVoice(oldState: VoiceState, newState: VoiceState){
        const member = oldState.member || newState.member;
        const userId = member?.id;
      
        if (newState.channel && userId && !oldState.channel) {
          // Entrou em um canal
          console.log("Entrou em um canal");
      
          this.startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
          if (!this.voiceTime.has(userId)) {
            // Se o usuário não estava em um canal antes, inicializa o tempo
            this.voiceTime.set(userId, 0);
          }
        }
      
        if (oldState.channel && userId && !newState.channel) {
          // Saiu de um canal
          console.log("Saiu do canal");
          
          const endTime = Math.floor(Date.now() / 1000); // Converte para segundos
          const startTime = this.startTimePerUser.get(userId);
      
          const timeInVoiceToAdd = endTime - startTime!;
          console.log('timeInVoiceToAdd', timeInVoiceToAdd);
      
          const oldVoiceTime = this.voiceTime.get(userId) || 0;
          console.log('oldVoiceTime', oldVoiceTime);
      
          const newVoiceTime = oldVoiceTime + timeInVoiceToAdd;
          console.log("setou", newVoiceTime);
      
          this.voiceTime.set(userId, newVoiceTime);
          
          this.startTimePerUser.set(userId, 0); //reset
        }
        console.log("voiceTime", this.voiceTime.get(userId!));
    }
}
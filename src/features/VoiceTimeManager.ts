import { Message, VoiceState } from "discord.js";
import sqlite3 from "sqlite3";

export class VoiceTimeManager {
    private startTimePerUser = new Map<string, number>();
    private voiceTime = new Map<string, number>();
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("db", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            } else {
                console.log("Conectado ao banco de dados SQLite");
                this.createTables();
            }
        });
    }

    private createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS voice_times (
                user_id TEXT PRIMARY KEY,
                total_time INTEGER
            )
        `);
    }

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

    public CountUsersTimeOnVoice(oldState: VoiceState, newState: VoiceState){
        const member = oldState.member || newState.member;
        const userId = member?.id;
      
        if (newState.channel && userId && !oldState.channel) {
          // Entrou em um canal
          console.log("Entrou em um canal");
      
          this.startTimePerUser.set(userId, Math.floor(Date.now() / 1000));
          if (!this.voiceTime.has(userId)) {
            // Se o usuário não estava em um canal antes, inicializa o tempo
            // TODO: Alterar para que ele puxe do SQLite o tempo ao inves de ficar guardando em memória. 
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
          if(!timeInVoiceToAdd) return;
      
          const oldVoiceTime = this.voiceTime.get(userId);
          console.log('oldVoiceTime', oldVoiceTime);
      
          const newVoiceTime = oldVoiceTime! + timeInVoiceToAdd;
          console.log("setou", newVoiceTime);
      
          this.voiceTime.set(userId, newVoiceTime);
          
          this.saveToDatabase(userId, newVoiceTime);
          this.startTimePerUser.set(userId, 0); //reset
        }
        console.log("voiceTime", this.voiceTime.get(userId!));
        console.log(this.getTimeByUserId(userId!));
    }

    private getTimeByUserId(userId: string){
        return this.db.get(`SELECT total_time FROM voice_times WHERE user_id = ?`, [userId], (err, row)=>{
            if (err) {
                return console.error(err.message);
              }
              return row
                ? console.log(row)
                : console.log(``);
        });
    }


    private saveToDatabase(userId: string, totalVoiceTime: number) {
        this.db.run(`
            INSERT OR REPLACE INTO voice_times (user_id, total_time)
            VALUES (?, ?)
        `, [userId, totalVoiceTime]);
    }
}
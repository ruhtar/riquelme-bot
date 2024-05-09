import sqlite3 from "sqlite3";

export class Repository{
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            }
        });
    }
    public incrementCommandCounter(command: string){
        const stmt = this.db.prepare(`UPDATE counter SET ${command} = ${command} + 1`);
        stmt.run();
        stmt.finalize();
    }

    public getCommandCounter(command: string) : any { //yes, i know, judge me
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT ${command} FROM counter`, (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                if (row) {
                    resolve(row);
                } else {
                    resolve(null); 
                }
            });
        })
    }

    public getTimeInVoiceByUserId(userId: string): Promise<number | null> {
        //A consulta ao SQLite deve ser feita de maneira assíncrona, por isso preciso retornar uma Promise
        // **Li que a maneira correta é lidar com os callbacks, mas ficaria horrível, melhor usar Promise mesmo
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT total_time FROM time_in_voice WHERE user_id = ?`, [userId], (err, row: { total_time: number }) => {
                if (err) {
                    reject(err.message);
                    return;
                }
    
                if (row && row.total_time) {
                    resolve(row.total_time);
                } else {
                    resolve(null); 
                }
            });
        });
    }

    public saveTotalVoiceTimeToDatabase(userId: string, totalVoiceTime: number) {
        this.db.run(`
            INSERT OR REPLACE INTO time_in_voice (user_id, total_time)
            VALUES (?, ?)
        `, [userId, totalVoiceTime]);
    }
}
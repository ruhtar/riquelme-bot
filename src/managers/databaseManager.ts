import sqlite3 from "sqlite3";

export class DatabaseManager{
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            }
        });
    }

    public getVoiceTimeByUserId(userId: string): Promise<number | null> {
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

    public saveToDatabase(userId: string, totalVoiceTime: number) {
        this.db.run(`
            INSERT OR REPLACE INTO time_in_voice (user_id, total_time)
            VALUES (?, ?)
        `, [userId, totalVoiceTime]);
    }
}
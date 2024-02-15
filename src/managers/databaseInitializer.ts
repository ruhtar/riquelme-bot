import sqlite3 from "sqlite3";

export class DatabaseInitializer{
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            } else {
                console.log("Conectado ao banco de dados SQLite");
                this.createTimeInVoiceTable();
            }
        });
    }

    private createTimeInVoiceTable() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS time_in_voice (
                user_id TEXT PRIMARY KEY,
                total_time INTEGER
            )
        `);
    }
}
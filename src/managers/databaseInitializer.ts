import sqlite3 from "sqlite3";

export class DatabaseInitializer{
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            } else {
                console.log("Conectado ao banco de dados SQLite");
                this.db.serialize(()=>{
                    this.createTimeInVoiceTable();
                    this.createCounterTable();
                    this.insertZeroCounter();
                });
            }
        });
    }
    private createCounterTable() {
        this.db.run(`
        CREATE TABLE IF NOT EXISTS counter (
            id TEXT PRIMARY KEY,
            darkleo INTEGER DEFAULT 0,
            laele INTEGER DEFAULT 0,
            lanchinho INTEGER DEFAULT 0,
            safadeza INTEGER DEFAULT 0,
            fakenews INTEGER DEFAULT 0,
            flash INTEGER DEFAULT 0
            )
        `);
    }

    private insertZeroCounter(){
        this.db.get(`SELECT * FROM counter WHERE id = 'default'`, (err, row) => {
            if (!row) {
                this.db.run(`
                    INSERT INTO counter (id, darkleo, laele, lanchinho, safadeza, fakenews, flash)
                    VALUES ('default', 0, 0, 0, 0, 0, 0)
                `);
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
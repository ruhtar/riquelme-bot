import sqlite3 from "sqlite3";

export class DatabaseInitializer {
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            } else {
                console.log("Conectado ao banco de dados SQLite");
                this.db.serialize(() => {
                    this.createTimeInVoiceTable();
                    this.createCommandsTables();
                    this.createMessagesCounterTables();
                });
            }
        });
    }

    private createCommandsTables() {
        this.db.run(`
        CREATE TABLE IF NOT EXISTS commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT , 
            user_id TEXT,
            command TEXT DEFAULT NULL,
            date TEXT
        )
        `);
    }

    private createMessagesCounterTables() {
        this.db.run(`
        CREATE TABLE IF NOT EXISTS messages_counter (
            id INTEGER PRIMARY KEY AUTOINCREMENT , 
            user_id TEXT,
            message_text TEXT DEFAULT NULL,
            date TEXT
        )
        `);
    }

    private createTimeInVoiceTable() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS time_in_voice (
                id INTEGER PRIMARY KEY AUTOINCREMENT , 
                user_id TEXT,
                total_time INTEGER,
                date TEXT
            )
        `);
    }
}
import sqlite3 from "sqlite3";
import { counterCommandsList } from "../commands/commandsList";

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
        let columns = this.generateColumns(); // Gera a parte das colunas da tabela
        this.db.run(`
            CREATE TABLE IF NOT EXISTS counter (
                id TEXT PRIMARY KEY,
                ${columns}
            )
        `);
    }
    
    private generateColumns(): string {
        let columns = counterCommandsList.map(command => `${command} INTEGER DEFAULT 0`).join(", ");
        return columns;
    }
    
    private insertZeroCounter() {
        this.db.get(`SELECT * FROM counter WHERE id = 'default'`, (err, row) => {
            if (!row) {
                let columnNames = counterCommandsList.join(", ");
                let columnValues = counterCommandsList.map(() => "0").join(", ");
                this.db.run(`
                    INSERT INTO counter (id, ${columnNames})
                    VALUES ('default', ${columnValues})
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
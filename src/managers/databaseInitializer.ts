import sqlite3 from "sqlite3";
import { counterCommandsList } from "../conts/commandsList";

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
                    this.createCommandsTables();
                });
            }
        });
    }
    private createCommandsTables() {
        counterCommandsList.forEach((command) => {
            this.db.run(`
            CREATE TABLE IF NOT EXISTS ${command} (
                id TEXT PRIMARY KEY,
                ${command}_counter INTEGER DEFAULT NULL
            )
            `);

            this.insertZeroCounters(command)
        })
    }

    private insertZeroCounters(command: string) {
        this.db.get(`SELECT * FROM ${command} WHERE id = 'default'`, (err, row) => {
            if (!row) {
                this.db.run(`
                    INSERT INTO ${command} (id, ${command}_counter)
                    VALUES ('default', 0)
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
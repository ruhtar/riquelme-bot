import sqlite3 from "sqlite3";
import { getCurrentMonthAndYear } from "../utils/actual-month";

export class Repository {
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            }
        });
    }

    public insertCommand(command: string, userId: string, date: string = getCurrentMonthAndYear()) {
        this.db.run(`INSERT INTO commands (user_id, command, date) VALUES (? , ?, ?)`, [userId, command, date]);
    }

    public getCommandCounter(command: string, userId: string = "", date: string = ""): any { //yes, i know, judge me
        let query = 'SELECT COUNT(*) AS count FROM commands WHERE command = ?';

        let params = [command];

        if (userId !== "") {
            query += ' AND user_id = ?';
            params.push(userId);
        }

        if (date !== "") {
            query += ' AND date = ?';
            params.push(date);
        }

        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                if (row) {
                    resolve(row)
                } else {
                    resolve(null);
                }
            });
        });
    }

    public getUsersTimeInVoiceByDate(userId: string, date: string = getCurrentMonthAndYear()): Promise<number | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT SUM(total_time) AS total_time FROM time_in_voice WHERE user_id = ? AND date = ?`, [userId, date], (err, row: { total_time: number }) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(row ? row.total_time : null);
            });
        });
    }

    public saveTotalVoiceTimeToDatabase(userId: string, totalVoiceTime: number, date: string = getCurrentMonthAndYear()) {
        this.db.run(`
            INSERT INTO time_in_voice (user_id, total_time, date)
            VALUES (?, ?, ?)
        `, [userId, totalVoiceTime, date]);
    }

    public getTopCommandsByMonthAndYear(date: string | null = null): Promise<CommandCount[] | any> {
        let query = `
            SELECT command, COUNT(command) as count
            FROM commands
        `;
    
        const params: any[] = [];
    
        if (date) {
            query += `
                WHERE date = ?
            `;
            params.push(date);
        }
    
        query += `
            GROUP BY command
            ORDER BY count DESC
            LIMIT 3
        `;
    
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err.message);
                    return;
                }
    
                resolve(rows);
            });
        });
    }
    
    public getTopActiveUsersByMonthAndYear(date: string | null = null, top: boolean = true): Promise<any> {
        let query = `
        SELECT user_id, SUM(total_time) AS totalTime
        FROM time_in_voice
        `;
        
        const params: any[] = [];
        
        if (date) {
            query += `
            WHERE date = ? AND user_id != 973751803860639774
            `;
            params.push(date);
        }else{
            query += `
            WHERE user_id != 973751803860639774
            `;
        }
        
        query += `
        GROUP BY user_id
        ORDER BY totalTime ${top ? "DESC" : "ASC"}
        LIMIT 3;
        `;
        
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err.message);
                    return;
                }
        
                resolve(rows);
            });
        });
    }
}
export interface CommandCount {
    command: string;
    count: number;
}

export interface UserActiveReport {
    user_id: string,
    totalTime: number
}
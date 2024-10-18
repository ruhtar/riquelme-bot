import sqlite3 from "sqlite3";
import { CommandCount, UserActiveReport } from "../structs/types/DataTypes";
import { getCurrentMonthAndYear } from "../utils/date-functions";

export class Repository {
    public db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err.message);
            }
        });
    }

    public saveUserMessage(userId: string, message: string, date: string = getCurrentMonthAndYear()){
        this.db.run(`INSERT INTO messages_counter (user_id, message_text, date) VALUES (?, ?, ?)`, [userId, message, date]);
    }

    public insertCommand(command: string, userId: string, date: string = getCurrentMonthAndYear()) {
        this.db.run(`INSERT INTO commands (user_id, command, date) VALUES (? , ?, ?)`, [userId, command, date]);
    }

    // public getMessagesCounter(userId: string = "", date: string = ""): Promise<number> {
    //     let query = 'SELECT COUNT(*) AS count FROM messages_counter WHERE';
    
    //     let params = [];
    
    //     if (userId !== "") {
    //         query += ' user_id = ?';
    //         params.push(userId);
    //     }
    
    //     if (date !== "") {
    //         query += ' AND date = ?';
    //         params.push(date);
    //     }
    
    //     return new Promise((resolve, reject) => {
    //         this.db.get(query, params, (err, row: {count: number}) => {
    //             if (err) {
    //                 reject(err.message);
    //                 return;
    //             }
    //             resolve(row ? row.count: 0); 
    //         });
    //     });
    // }

    public getCommandCounter(command: string, userId: string = "", date: string = ""): Promise<number> {
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
            this.db.get(query, params, (err, row: {count: number}) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                resolve(row ? row.count: 0); 
            });
        });
    }

    public getUsersTimeInVoiceByDate(userId: string, date?: string): Promise<number | null> {
        return new Promise((resolve, reject) => {
            let query = `SELECT SUM(total_time) AS total_time FROM time_in_voice WHERE user_id = ?`;
            let params: (string | null)[] = [userId];
    
            if (date) {
                query += ` AND date = ?`;
                params.push(date);
            }
    
            this.db.get(query, params, (err, row: { total_time: number }) => {
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

    public getTopCommandsByMonthAndYear(date: string | null = null): Promise<CommandCount[]> {
        let query = `
            SELECT command, COUNT(command) as count
            FROM commands
        `;
    
        const params:( string | null)[] = [];
    
        if (date) {
            query += `
                WHERE date = ?
            `;
            params.push(date);
        }
    
        query += `
            GROUP BY command
            ORDER BY count DESC
            LIMIT 5
        `;
    
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows : [{command: string, count: number}]) => {
                if (err) {
                    reject(err.message);
                    return;
                }
    
                resolve(rows);
            });
        });
    }
    
    public getTopActiveUsersByMonthAndYear(date: string | null = null, top: boolean = true): Promise<UserActiveReport[]> {
        let query = `
        SELECT user_id, SUM(total_time) AS totalTime
        FROM time_in_voice
        `;
        
        const params: (string | null)[] = [];
        
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
        LIMIT 5;
        `;
        
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows: [{user_id: string, totalTime: number}]) => {
                if (err) {
                    reject(err.message);
                    return;
                }
        
                resolve(rows);
            });
        });
    }
}
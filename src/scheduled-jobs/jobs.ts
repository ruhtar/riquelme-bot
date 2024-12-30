import schedule from 'node-schedule';
import { checkBirthday } from '../managers/birthday-manager';
import { generateReport } from '../managers/report-manager';

export const jobInit = () => {
    schedule.scheduleJob('0 3 * * *', async function () {
        console.log("Executando verificação de aniversário todos os dias à meia-noite.");
        await checkBirthday();
    });

    schedule.scheduleJob('0 3 1 * *', function () {
        console.log("Executando no primeiro dia do mês.");
        generateReport();
    });
}
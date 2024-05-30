import { CommandCount, Repository, UserActiveReport } from "../database/repository";
import { getCurrentMonthAndYear } from "../utils/actual-month";

export const generateReport = async () => {
    try {
        let repo = new Repository()

        const result: CommandCount[] = await repo.getTopCommandsByMonthAndYear(getCurrentMonthAndYear());

        const result2: UserActiveReport[] = await repo.getTopActiveUsersByMonthAndYear(getCurrentMonthAndYear());

        result2.forEach((item) => {
            const hours = Math.floor(item.totalTime / 3600);
            const minutes = Math.floor((item.totalTime % 3600) / 60);
            const seconds = item.totalTime % 60;
        })
        //fazer o relatorio mensal
        //preparar a tabela de voiceTime criando uma nova coluna com o mes e o ano    
    } catch (error) {
        console.log('error', error)
    }
};

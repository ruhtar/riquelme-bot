export const getCurrentMonthAndYear = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Os meses são de 0 a 11
    const day = today.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
}

export const getCurrentMonthName = () => {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dataAtual = new Date();
    const nomeMes = months[dataAtual.getMonth()];
    return nomeMes;
}

export const getPreviousMonthAndYear = (): string => {
    const dataAtual = new Date();
    let mes: number = dataAtual.getMonth();
    let ano: number = dataAtual.getFullYear();

    if (mes === 0) {
        mes = 11;
        ano--;
    } else {
        mes--;
    }

    const mesFormatado: string = String(mes + 1).padStart(2, '0');
    const anoFormatado: string = String(ano).slice(-2);

    return `${mesFormatado}-${anoFormatado}`;
}
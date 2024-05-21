export const getCurrentMonthAndYear = () => {
    const dataAtual = new Date();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); 
    const ano = String(dataAtual.getFullYear()).slice(-2);
    return `${mes}-${ano}`;
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
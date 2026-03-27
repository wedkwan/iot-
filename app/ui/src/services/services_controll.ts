import api from "./api";


export const listarComandosSala = (sala: string) => {
  return api.get(`/comandos/${sala}`);
};

export const TrasmitirComando = ( sala : string, dados:{
    indice :string;
}) => {
    return api.post(`comandos/${sala}/retransmitir` ,dados)
}

export const ApagarListaComandos = (sala: string)=>{
    return api.post(`comandos/${sala}/apagar`)
}
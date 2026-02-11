import api from "./api";


export const listarComandosSala = (sala: string) => {
  return api.get(`/comandos/${sala}`);
};

export const TrasmitirComando = (dados:{
    indice :string;
}) => {
    return api.post('comandos/retransmitir' ,dados)
}

export const ApagarListaComandos = ()=>{
    return api.post('comandos/apagar')
}
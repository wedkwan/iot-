import api from "./api";

export  const listar_comandos = () => {
  return api.get('/comandos');
};

export const trasmitir_comando = (dados:{
    indice :string;
}) => {
    return api.post('comandos/retransmitir' ,dados)
}

export const apagar_lista_comandos = ()=>{
    return api.post('comandos/apagar')
}
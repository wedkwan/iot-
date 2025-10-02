import { useEffect, useState } from "react";
import { listar_comandos, trasmitir_comando } from "../services/services_controll";

type Comando = {
  indice: string;
  nome: string;
};

export default function  Buttons() {
  const [lista, setLista] = useState<Comando[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listar_comandos();
        setLista(response.data.lista); 
      } catch (error) {
        console.error("Erro ao carregar comandos:", error);
      }
    };

    fetchData();
  }, []);

  
  const handleClick =  ( indice : string) => {
    trasmitir_comando({indice});
    
    
  };

  return (
    <div className="">
      <h2>Comandos</h2>
      {lista.map((cmd) => (
        <button 
          key={cmd.indice} 
          onClick={() => handleClick(cmd.indice )} 
         className=""
        >
        {cmd.nome}
        </button>
      ))}
    </div>
  );
}

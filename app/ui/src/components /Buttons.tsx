import { } from "react";
import { trasmitir_comando } from "../services/services_controll";

type Comando = {
  indice: string;
  nome: string;
};

export default function  Buttons() {
const lista : Comando [] = [{ indice : "0" , nome : "ligar" 
}, { indice : "2" , nome : "ligar" 
},{ indice : "1" , nome : "desligar" 
}, { indice : "3" , nome : "temp+" 
},{ indice : "5" , nome : "tenp-" 
}]

  
  const handleClick =  ( indice : string) => {
    trasmitir_comando({indice});
  };

  return (
    <div className="background-white p-5 rounded-lg shadow-md">
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

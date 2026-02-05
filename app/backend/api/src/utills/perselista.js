
export function parseListaComandos(listaBruta) {
  
  const comandos = listaBruta
    .split(";") 
    .filter(item => item.trim() !== "") 
    .map(item => {
      const [indice, nome] = item.split(":");
      return { indice: parseInt(indice), nome: nome.trim() };
    });
  return comandos;
}


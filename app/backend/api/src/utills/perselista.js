export function parseListaComandos(listaBruta) {
  return listaBruta
    .split(";")
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => {
      const [indice, nome] = item.split(":");
      return {
        indice: Number(indice),
        nome: (nome || "").replace(/[\r\n]/g, "").trim()
      };
    });
}


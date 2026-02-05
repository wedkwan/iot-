import { findorcreateSala } from "./models/Sala.js";
import { findorcreateSensor } from "./models/Sensor.js";
import { createLeitura } from "./models/Leitura.js";

async function test() {
    try {
        const local = "LABF04";
        const device_id = "ESP32-02";
        const corrente = 29;
        const timestamp = Date.now();

        const salaId = await findorcreateSala(local);
        console.log("Sala ID:", salaId);

        const sensorId = await findorcreateSensor(device_id, "ambiente", salaId);
        console.log("Sensor ID:", sensorId);

        await createLeitura(sensorId, "corrente", corrente , timestamp);
      
       

        console.log("Dados salvos com sucesso!");
    } catch (err) {
        console.log("Erro ao salvar no banco:", err.message);

    }
}

test();
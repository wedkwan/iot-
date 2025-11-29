import client from "../config/mqtt.js";
import { findorcreateSala } from "../models/Sala.js";
import { findorcreateSensor } from "../models/Sensor.js";
import { createLeitura } from "../models/Leitura.js";
client.subscribe("campus/+/temperatura");
client.on("message",async (topic, message)=>{
    console.log("📩 Chegou mensagem MQTT no tópico:", topic);
    console.log("Mensagem bruta:", message.toString());
    try{
        const data = JSON.parse(message.toString());
        console.log(data)
        const {
            device_id , 
            local ,
            temperatura,
            umidade ,
            corrente , 
            
        } = data
        const salaId = await findorcreateSala(local);
        const sensorId = await findorcreateSensor(device_id, "ambiente" ,salaId);
        if (temperatura !== undefined ){
            await createLeitura(sensorId, "temperatura",temperatura )
        }
         if (umidade !== undefined ){
            await createLeitura(sensorId, "umidade",umidade )

        } if (corrente !== undefined ){
            await createLeitura(sensorId, "corrente",corrente )
        }


        
    }catch(err){
        console.log("erro ao proscessar mqtt",err.message);
    }

    
});

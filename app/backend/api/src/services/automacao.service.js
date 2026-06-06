import client from "../configs/mqtt.js";
import { retransmitirComando } from "./comandos.service.js";
client.removeAllListeners('message');

client.on("message",async(topic,message )=>{
    console.log("movimento de detectado no topico:",topic)
    try{
        const data = JSON.parse(message.toString())
        console.log(data)
        const { 
            local,
            presenca
            
        }= data 

        if (presenca == true ){
            retransmitirComando(local, 1)
        }

        if(presenca == false){
            retransmitirComando(local, "desligar")
        }
      

    }catch(err){
        
    }
})
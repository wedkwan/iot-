const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão MQTT
const client = mqtt.connect("mqtt://192.168.18.84:1883"); 

let listaComandos = "";
let ultimaResposta = "";

// Conexão ao MQTT
client.on("connect", () => {
  console.log("Conectado ao MQTT");
  client.subscribe("smartcampus/comandos/resposta");
});


client.on("message", (topic, message) => {
  const msgStr = message.toString();
  if (topic.toString() === "smartcampus/comandos/resposta") {
    ultimaResposta = msgStr;

   
    if (msgStr.includes(";")) {
      listaComandos = msgStr;
    }
  }
});



// Retorna a última lista de comandos
app.get("/comandos", (req, res) => {
  res.json({ lista: listaComandos });
});

// Solicitar ao ESP32 para listar comandos
app.post("/comandos/listar", (req, res) => {
  client.publish("smartcampus/comandos/listar", "");
  res.json({ msg: "Pedido de listagem enviado ao ESP32" });
});

// Apagar todos os comandos
app.post("/comandos/apagar", (req, res) => {
  client.publish("smartcampus/comandos/apagar", "");
  res.json({ msg: "Pedido de apagar enviado ao ESP32" });
});

// Retransmitir comando pelo índice
app.post("/comandos/retransmitir", (req, res) => {
  const { idx } = req.body;
  if (idx === undefined) return res.status(400).json({ error: "Índice obrigatório" });
  client.publish("smartcampus/comandos/retransmitir -m ", String(idx));
  res.json({ msg: `Pedido de retransmissão do comando ${idx} enviado ao ESP32` });

app.post("/comandos/novo", (req, res) => {
  const { nome, codigo, bits, protocolo } = req.body;
  if (!nome || codigo === undefined || bits === undefined || protocolo === undefined) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const payload = `${nome},${codigo},${bits},${protocolo}`;
  client.publish("smartcampus/comandos/novo", payload);
  res.json({ msg: `Pedido de adicionar comando "${nome}" enviado ao ESP32` });

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

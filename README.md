# IoT Smart Campus - IFPE Igarassu

## 📝 Descrição

Sistema IoT para gerenciamento de recursos energéticos no IFPE Campus Igarassu. Solução que utiliza dispositivos IoT para monitorar e controlar ar-condicionados, otimizando o consumo de energia da instituição.

Este projeto faz parte do programa de extensão BIA (Bolsa de Incentivo Acadêmico).

**Stack Tecnológico:**
- Frontend: React
- Backend: Node.js
- Comunicação: MQTT
- Banco de Dados: MYSQL
- Orquestração: Docker

---

## 🏗️ Arquitetura do Sistema

A solução utiliza uma **arquitetura em camadas** para separação de responsabilidades e escalabilidade:

### Camada de Interação
- **Frontend React**: Dashboard e monitoramento
- Interface responsiva para visualização de dados
- Controle de dispositivos IoT

### Camada de Integração
- **Backend Node.js**: API REST/WebSocket
- **Mosquitto MQTT Broker**: Comunicação pub/sub
- Processamento de eventos em tempo real

### Camada de Rede
- Protocolo **MQTT** para IoT
- Comunicação bidirecional entre dispositivos e broker
- Baixa latência e consumo otimizado

### Camada de Armazenamento
- **PostgreSQL**: Persistência de dados
- Histórico de temperatura, umidade e consumo
- Logs de operações

---

## 🔧 Hardware IoT

- **ESP32**: Microcontrolador principal
- **DHT11**: Sensor de temperatura e umidade
- **SCT013**: Sensor de corrente (monitoramento de energia)
- **Módulo IR**: Controle remoto de ar-condicionados

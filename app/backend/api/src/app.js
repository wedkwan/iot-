import express from "express";
import cors from "cors";
import comandosRoutes from "./routes/comandos.routes.js";
import temperaturasRoutes from "./routes/temperatura.routes.js";
import umidadeRoutes from "./routes/umidade.routes.js"
import salasRoutes from "./routes/salas.routes.js"
import consumoRoutes from "./routes/consumo.routes.js"
const app = express();
app.use(express.json());
app.use(cors());
app.use("/smartcampus/comandos" , comandosRoutes)
app.use("/smartcampus" ,temperaturasRoutes)
app.use("/smartcampus" , umidadeRoutes)
app.use("/smartcampus" , salasRoutes)
app.use("/smartcampus" , consumoRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
 

export default app;
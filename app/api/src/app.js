import express from "express";
import cors from "cors";
import comandosRoutes from "./routes/comandos.routes.js";
import temperaturasRoutes from "./routes/temperatura.routes.js";
import "./services/temperatura.service.js"
const app = express();
app.use(express.json());
app.use(cors());

app.use("/comandos" , comandosRoutes)
app.use("/temperaturas" ,temperaturasRoutes)

const PORT = process.env.PORT || 3000;



app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`API rodando em http://localhost:${PORT}`);
});


export default app;
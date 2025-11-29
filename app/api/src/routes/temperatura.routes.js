import { Router } from "express";


import { gettemp , getMetricasSala } from "../controllers/temperatura.controller.js";

const temperaturasRoutes = Router();

temperaturasRoutes.get("/temp",gettemp)

temperaturasRoutes.get("/:sala/metricas", getMetricasSala);

export default temperaturasRoutes
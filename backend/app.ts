import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import seasonsRoutes from "./routes/seasons-routes.ts";
import driversRoutes from "./routes/drivers-routes.ts";
import constructorsRoutes from "./routes/constructors-routes.ts";
import resultsRoutes from "./routes/results-routes.ts";
import standingsRoutes from "./routes/standings-routes.ts";
import qualifyingRoutes from "./routes/qualifying-routes.ts";
import pitstopsRoutes from "./routes/pitstops-routes.ts";
import lapsRoutes from "./routes/laps-routes.ts";
import statusRoutes from "./routes/status-routes.ts";
import racesRoutes from "./routes/races-routes.ts";

const app = express();

const __dirname = process.cwd() + "/backend/docs";

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
    res.send("API is running...");
});

app.use("/api/seasons", seasonsRoutes);
app.use("/api", driversRoutes);
app.use("/api", constructorsRoutes);
app.use("/api", resultsRoutes);
app.use("/api", standingsRoutes);
app.use("/api", qualifyingRoutes);
app.use("/api", pitstopsRoutes);
app.use("/api", lapsRoutes);
app.use("/api/status", statusRoutes);
app.use("/api", racesRoutes);

export default app;

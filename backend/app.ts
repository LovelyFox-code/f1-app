import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import seasonsRoutes from "./routes/seasons-routes.ts";
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
app.use("/api/seasons", racesRoutes);

export default app;

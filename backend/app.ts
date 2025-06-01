import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import seasonsRoutes from "./routes/seasons-routes.ts";
const app = express();

const __dirname = process.cwd() + "/backend/docs";

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use(express.json());
app.use(cors());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/seasons", seasonsRoutes);

app.get("/", (_req, res) => {
    res.send("API is running...");
});

export default app;

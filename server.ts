import cors from "cors";
import express, { type Express } from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

import handleConnection from "./handlers/connection.handler";
import apiRouter from "./src/routes/api";
const swaggerDocument = require("./swagger.json");

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

try {
    io.on("connection", handleConnection);
}
catch (error) {
    console.log(error);
}

export default server;

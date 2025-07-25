import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import reservasRoute from "./routes/reservaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import salasRoutes from "./routes/salasRoutes.js";
import favRoutes from "./routes/favRoutes.js";
import pesquisaRoutes from "./routes/pesquisaRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/reservas", reservasRoute);
app.use("/users", userRoutes);
app.use("/salas", salasRoutes);
app.use("/users", favRoutes);
app.use("/pesquisa", pesquisaRoutes);

export default app;
//fazer as rotas de salas (inserir + consultar mapa)
//fazer as rotas de favoritos (favoritar + consultar)

import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

import _dirname from "./dirname.js";
import viewRoutes from "./routes/views.routes.js";
import { connectDB } from "./config/mongoDb.config.js";
import apiRoutes from "./routes/index.routes.js";
import { configurePassport } from "./config/passport.config.js";

// Conexión a la base de datos
connectDB();

const PORT = 8080;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars como motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", _dirname + "/views");
app.set("view engine", "handlebars");

// Archivos estáticos
app.use(express.static("public"));

// Configuración de sesión y cookies
app.use(
  session({
    secret: "codigoSecreto",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Rutas
app.use("/", viewRoutes);  // Rutas de vistas
app.use("/api", apiRoutes);  // Rutas de API

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

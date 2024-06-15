// import express from "express";
// import router from "./routes/index.js";
// import session from "express-session";
// import { connectMongoDB } from "./config/mongoDb.config.js"
// import MongoStore from "connect-mongo";

// connectMongoDB();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: "mongodb+srv://sairesifontes:Fiestalas17K@ecommerce.japcrgv.mongodb.net/ecommerce",
//       ttl: 15,
//     }),
//     secret: "CodigoSecreto",
//     resave: true,
//   })
// );

// app.use("/api", router);

// app.listen(8080, () => {
//   console.log("Escuchando el servidor en el puerto 8080");
// });



import express from "express";
import router from "./routes/index.js";
import { connectMongoDB } from "./config/mongoDb.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";

// Conectar a MongoDB
connectMongoDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("mi_secreto")); 

// Configuración de sesión
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "Link en la entrega",
      ttl: 15 * 60, // Ajusté TTL a segundos
    }),
    secret: "mi_codigo_secreto",
    resave: true,
    saveUninitialized: true,
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Rutas
app.use("/api", router);

// Puerto de escucha
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

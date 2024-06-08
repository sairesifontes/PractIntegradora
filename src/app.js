import express from "express";
import router from "./routes/index.js";
import session from "express-session";
import { connectMongoDB } from "./config/mongoDb.config.js"
import MongoStore from "connect-mongo";

connectMongoDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://sairesifontes:Fiestalas17K@ecommerce.japcrgv.mongodb.net/ecommerce",
      ttl: 15,
    }),
    secret: "CodigoSecreto",
    resave: true,
  })
);

app.use("/api", router);

app.listen(8080, () => {
  console.log("Escuchando el servidor en el puerto 8080");
});

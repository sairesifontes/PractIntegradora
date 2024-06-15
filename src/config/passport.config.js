import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20";
import { hashPassword, checkPassword } from "../utils/hashPassword.js";
import userDao from "../dao/mongoDao/user.dao.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          const user = await userDao.getByEmail(username);
          if (user) return done(null, false, { message: "El usuario ya existe" });

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password),
          };

          const createUser = await userDao.create(newUser);
          return done(null, createUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userDao.getByEmail(username);
        if (!user || !checkPassword(user, password)) return done(null, false, { message: "email o password inválidos" });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: "YOUR_GOOGLE_CLIENT_ID",
        clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
        callbackURL: "http://localhost:8080/api/session/google",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { name, emails } = profile;

          const user = {
            first_name: name.givenName,
            last_name: name.familyName,
            email: emails[0].value,
          };

          const existUser = await userDao.getByEmail(emails[0].value);
          if (existUser) return cb(null, existUser);

          const newUser = await userDao.create(user);
          cb(null, newUser);
        } catch (error) {
          return cb(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userDao.getById(id);
    done(null, user);
  });
};

export default initializePassport;






















































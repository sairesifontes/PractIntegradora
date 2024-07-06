import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userService from "../services/user.services.js";
import accountService from "../services/account.services.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const configurePassport = () => {
  // Estrategia local para el registro
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      try {
        const { firstName, surname } = req.body;
        const existingUser = await userService.getUser({ email: username });
        if (existingUser) return done(null, false, { message: "User already exists" });

        const newAccount = await accountService.createAccount({ firstName, surname });

        const newUser = {
          firstName,
          surname,
          email: username,
          password: createHash(password),
          account: newAccount._id,
        };

        const createdUser = await userService.registerUser(newUser);

        await accountService.linkAccountToUser(newAccount._id, { userId: createdUser._id });

        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Estrategia local para el inicio de sesión
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userService.getUser({ email: username });
        if (!user || !isValidPassword(user, password)) return done(null, false, { message: "Invalid email or password" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Estrategia JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secretCode",
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUser({ _id: id});
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};



















































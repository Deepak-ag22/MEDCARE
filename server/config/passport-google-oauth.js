const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");
const db = require("./db.js");
require("dotenv").config();

const { GOOGLE_CLIENTID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

const opts = {
    clientID: GOOGLE_CLIENTID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
};

passport.use(
    new GoogleStrategy(
        opts,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userEmail = profile.emails[0].value;
                const alreadyUser = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [userEmail]
                );

                if (alreadyUser) {
                    return done(null, alreadyUser);
                }

                const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
                const newUser = await db.one(
                    `
                    INSERT INTO users(user_name, user_emailid, password)
                    VALUES($1, $2, $3)
                    RETURNING user_name, user_emailid, user_id;
                    `,
                    [profile.displayName, userEmail, randomPassword]
                );

                return done(null, newUser);
            } catch (err) {
                console.error("Google OAuth Error:", err);
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE user_id = $1",
            [id]
        );
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");
const db = require("./db.js");
require("dotenv").config();
let opts = {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

passport.use(
    new googleStrategy(
        opts,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const alreadyUser = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [profile.emails[0].value]
                );

                if (alreadyUser) {
                    return done(null, alreadyUser);
                }
                const query = `
                INSERT INTO users(user_name, user_emailid, password)
                VALUES($1, $2, $3)
                RETURNING user_name, user_emailid, user_id;
            `;

                const randomPassword = await bcrypt.hash(
                    Math.random().toString(36),
                    10
                );
                const result = await db.query(query, [
                    profile.displayName,
                    profile.emails[0].value,
                    randomPassword,
                ]);

                const newUser = result[0];
                return done(null, newUser);
            } catch (err) {
                console.error("Google Oauth Error:", err);
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
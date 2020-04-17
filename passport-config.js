const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const username = getUserByEmail(email)
        if(username == null) {
            return done(null, false, { message: "No user assosiated with the username" })
        }
         
        try {
            if (await bcrypt.compare(password, user.pass)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect password'})
            }
        } catch (e){
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { });
}

module.exports = initialize;
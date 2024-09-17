const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const localStrategy = new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return done(null, false, { message: 'User with email does not exist!' });
        }
        
        let isPasswordSame = await bcrypt.compare(password, user.password);
        if (!isPasswordSame) {
            return done(null, false, { message: 'Please enter valid credentials!' });
        }
        
        console.log(email);
        return done(null, user);
    } catch (error) { // Corrected variable name
        console.log("Error while login", error);
        return done(error);
    }
});


passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await User.findByPk(id);
    if (!user) {
        return done(null, false);
    }
    return done(null, user);
});

module.exports = localStrategy;
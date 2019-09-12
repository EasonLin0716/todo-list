const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') // require bcryptjs lib

const User = require('../models/users')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        // if user is not matched return not registered
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }
        // if user is matched compare password first arg: data to compare; second arg: data to be compared to
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Email and Password incorrect' })
          }
        })
      })
    })
  )

  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK, // 在用戶端 OAuth 設定的重新導向 URI
      profileFields: ['email', 'displayName'] // 因為我們的 user schema 需要使用者的 email，而這就要到 Facebook 回傳的 profile 物件中去取
    }, (accessToken, refreshToken, profile, done) => {
      console.log(profile._json)
      // find and create user
      User.findOne({
        email: profile._json.email
      }).then(user => {
        // if email not exist create new user
        if (!user) {
          // because password is needed so we create a random password for user, bcrypt it and save
          let randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              let newUser = User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save().then(user => {
                return done(null, user)
              }).catch(err => {
                console.log(err)
              })
            })
          )
        } else {
          return done(null, user)
        }
      })
    }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
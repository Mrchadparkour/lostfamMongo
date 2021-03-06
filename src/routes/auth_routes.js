import UserSchema from '../Schemas/UserSchema';
import jwt from 'jsonwebtoken';

module.exports = function (app, router) {
  router.route('/authenticate')
    .post((req, res) => {
      const { username, password } = req.body;
      UserSchema.findOne({ username }, (err, user) => {
        if (err) throw err;
        if (!user) res.json({ success: false, message: "Authentication Failed. User not found." });
        else {
          //if everything went good, check password with bcrypt method defined in UserSchema
          user.comparePassword(password, (err, isMatch) => {
            if(err) throw err;
            if (!isMatch) res.json({ success: false, message: "Authentication Failed. Incorrect username or password." });
            else {
              const payload = { user_id: user._id };
              const token = jwt.sign(payload, app.get('secret'), {
                expiresIn: 60 * 1440 * 30 * 3 //expires in 90 days
              });

              res.json({
                success: true,
                message: 'Token Granted.',
                token
              });
            }
          });
        }
      });
    });

  router.route('/register')
    //Create a new User
    .post((req, res) => {
      const { name, email, username, password } = req.body.form;
      const newUser = new UserSchema({ name, email, username, password, created_at: Date.now() });
      newUser.save(err => {
        if (err) {
          console.log(err);
          res.send({ success: false });
        } else {
          console.log('New user has been created.')
          res.send({ success: true });
        }
      })
  })
}

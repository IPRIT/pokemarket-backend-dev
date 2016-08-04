import { User } from '../../../../models';
import Log from 'log4js';
import { rememberUser } from "../session-manager";

const log = Log.getLogger('Google Auth');

export default (req, res, next) => {
  let googleUser = req.googleUser;

  getOrCreateUser(googleUser).then(user => {
    return rememberUser(user);
  }).then(tokenInstance => {
    res.json({
      token: tokenInstance.token
    });
  }).catch(err => next(err));
};

function getOrCreateUser(googleUser) {
  let { sub, email } = googleUser;

  return User.findOne({
    where: {
      $or: {
        email,
        googleId: sub
      }
    }
  }).then(user => {
    if (!user) {
      return createUser( googleUser );
    }
    log.info('Got user:\t', user && user.get({plain: true}).email);
    if (!user.googleId) {
      user.googleId = sub;
    }
    return user.save();
  });
}

function createUser({ sub, email, name }) {
  log.info('Creating user...:\t', email);
  return User.create({
    email,
    googleId: sub,
    fullname: name
  });
}
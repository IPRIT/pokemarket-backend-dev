import { User } from '../../../../models';
import Log from 'log4js';
import { rememberUser } from "../session-manager";

const log = Log.getLogger('models');

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
  let { sub } = googleUser;

  return User.findOne({
    where: {
      googleId: sub
    }
  }).then(user => {
    log.info('Got user:\t', user && user.get({raw: true}).email);
    if (!user) {
      return createUser( googleUser );
    }
    return user;
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
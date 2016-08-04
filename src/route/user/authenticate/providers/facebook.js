import { User } from '../../../../models';
import Log from 'log4js';
import { rememberUser } from "../session-manager";

const log = Log.getLogger('Facebook Auth');

export default (req, res, next) => {
  let facebookUser = req.facebookUser;

  getOrCreateUser(facebookUser).then(user => {
    return rememberUser(user);
  }).then(tokenInstance => {
    res.json({
      token: tokenInstance.token
    });
  }).catch(err => next(err));
};

function getOrCreateUser(facebookUser) {
  let { id, email } = facebookUser;

  return User.findOne({
    where: {
      $or: {
        email,
        facebookId: id
      }
    }
  }).then(user => {
    if (!user) {
      return createUser( facebookUser );
    }
    log.info('Got user:\t', user && user.get({plain: true}).email);
    if (!user.facebookId) {
      user.facebookId = id;
    }
    return user.save();
  });
}

function createUser({ id, email, name }) {
  log.info('Creating user...:\t', email);
  return User.create({
    email,
    facebookId: id,
    fullname: name
  });
}
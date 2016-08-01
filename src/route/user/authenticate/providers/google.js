import { User } from '../../../../models';
import Promise from 'bluebird';
import Log from 'log4js';

const log = Log.getLogger('models');

export default (req, res, next) => {
  let googleUser = req.googleUser;

  getOrCreateUser(googleUser).then(user => {
    //todo:
    res.json(
      user.get({ raw: true })
    );
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
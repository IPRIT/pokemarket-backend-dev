import { User, AuthToken } from '../models';

export default (req, res, next) => {
  if (req.user) {
    //todo: remove in production (this case is only for assertion)
    return next(new HttpError('The user already exists'));
  }
  let token = req.header('X-Token');
  if (!token || typeof token !== 'string') {
    return next();
  }
  getUser(token).then(user => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  }).catch(err => next(err));
};

function getUser(token) {
  return AuthToken.findOne({
    where: { token }
  }).then(token => {
    if (!token) {
      return null; // because it's required by our middleware fn
    }
    return token.getUser({
      attributes: {
        exclude: [ 'deletedAt' ]
      }
    })
  });
}
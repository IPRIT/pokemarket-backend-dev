import fb from 'facebook-node';
import deap from 'deap';

function isFacebookUserLike(obj) {
  let threeWhales = [ 'id', 'email', 'name' ];
  return threeWhales.every(whale => obj && obj.hasOwnProperty(whale));
}

export default function (req, res, next) {
  let accessToken = req.body.accessToken;

  //Bluebird's promisify fn works incorrectly for the fb.api. Returning to callbacks hell...(37%)
  fb.api('me', { fields: ['id', 'name', 'email'], access_token: accessToken }, facebookUser => {
    if (!isFacebookUserLike(facebookUser)) {
      return next(new Error('Facebook\'s user is not presented'));
    }
    deap.merge(req, { facebookUser });
    next();
  });
}
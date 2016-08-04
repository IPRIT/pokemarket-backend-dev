import verifier from 'google-id-token-verifier';
import config from './config';
import Promise from 'bluebird';
import deap from 'deap';

function isGoogleUserLike(obj) {
  let threeWhales = [ 'sub', 'email', 'name' ];
  return threeWhales.every(whale => obj && obj.hasOwnProperty(whale));
}

export default function (req, res, next) {
  let tokenId = req.body.tokenId;
  let clientId = config.google.clientId;
  let checkTokenId = Promise.promisify(verifier.verify);

  checkTokenId(tokenId, clientId).then(googleUser => {
    if (!isGoogleUserLike(googleUser)) {
      throw new HttpError('Google\'s user is not presented');
    }
    deap.merge(req, { googleUser });
    next();
  }).catch(err => {
    next(err);
  });
};
import crypto from 'crypto';
import Promise from 'bluebird';

export function rememberUser(user) {
  return generateCryptoToken().then(token => {
    return user.createAuthToken({token});
  });
}

function generateCryptoToken(bufferLength = 48) {
  let getRandomBytes = Promise.promisify(crypto.randomBytes);
  return getRandomBytes(bufferLength).then(buffer => {
    return buffer.toString('hex');
  });
}
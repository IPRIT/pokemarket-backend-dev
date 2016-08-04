import Log from 'log4js';
import sequelize from './sequelize';
import User from './User';
import AuthToken from './AuthToken';

const log = Log.getLogger('models');

log.info('Models syncing...');
sequelize.sync().then(() => {
  log.info('Models synced!');
}).catch(err => {
  log.fatal('Error:', err);
});

/**
 * Define relatives between models
 */
User.hasMany(AuthToken, { foreignKey: 'userUuid', targetKey: 'uuid' });

export { User, AuthToken };

import Log from 'log4js';
import sequelize from './sequelize';
import User from './User';

const log = Log.getLogger('models');

log.info('Models syncing...');
sequelize.sync().then(() => {
  log.info('Models synced!');
}).catch(err => {
  log.fatal('Error:', err);
});

export { User };

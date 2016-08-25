import Log from 'log4js';
import sequelize from './sequelize';
import User from './User';
import AuthToken from './AuthToken';
import Pokemon from './Pokemon';
import InventoryItem from './InventoryItem';
import Lot from './Lot';
import Promise from 'bluebird';

const log = Log.getLogger('models');


/**
 * Define relatives between models
 */
User.hasMany(AuthToken, { foreignKey: 'userUuid', targetKey: 'uuid' });
User.hasMany(InventoryItem);
//Pokemon.hasMany(InventoryItem, { foreignKey: 'pokemonUuid', targetKey: 'uuid' });

log.info('Models syncing...');
Promise.resolve().delay(0).then(() => sequelize.sync(/**/{ force: true }/**/)).then(() => {
  log.info('Models synced!');
}).catch(err => {
  log.fatal('Error:', err);
});

export { User, AuthToken, Pokemon, InventoryItem, Lot };

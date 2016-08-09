import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import deap from 'deap';

let Lot = sequelize.define('Lot', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: Sequelize.ENUM,
    values: [ 'sell', 'buy' ]
  },
  states: {
    type: Sequelize.ENUM,
    values: [ 'sent_request', '', '', '', '', '', '' ]
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  expired: {
    type: Sequelize.DATETIME,
    allowNull: false
  }
}, {
  paranoid: true,

  engine: 'INNODB',

  indexes: [{
    name: 'token_index',
    method: 'BTREE',
    fields: [ 'token' ]
  }],
  scopes: {
    active: {
      where: {
        isActive: false
      }
    }
  }
});

export default Lot;
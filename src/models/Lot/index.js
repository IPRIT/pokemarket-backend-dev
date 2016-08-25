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
  expired: {
    type: Sequelize.DATE,
    allowNull: false
  },
  isLocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  paranoid: true,
  engine: 'INNODB',
  defaultScope: {
    where: {
      $and: {
        isLocked: false,
        expired: {
          $gt: () => new Date()
        }
      }
    }
  }
});

export default Lot;
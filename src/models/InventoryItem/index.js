import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import deap from 'deap';

let InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  level: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
    validate: { min: 0, max: 10000 }
  }
}, {
  paranoid: true,
  engine: 'INNODB'
});

export default InventoryItem;
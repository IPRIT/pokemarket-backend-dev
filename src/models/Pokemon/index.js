import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import Promise from 'bluebird';
import deap from 'deap';

let Pokemon = sequelize.define('Pokemon', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  id: { // a pokedex id
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  height: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  weight: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  base_experience: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  image: {
    type: Sequelize.STRING
  },
  types: {
    type: Sequelize.STRING,
    defaultValue: 'unknown',
    get: function () {
      let groupsString = this.getDataValue('types');
      return groupsString.split(',');
    },
    set: function (val) {
      if (typeof val === 'string') {
        val = val.split(',');
      } else if (!Array.isArray(val)) {
        val = [];
      }
      this.setDataValue('types', val.join(','));
    }
  }
}, {
  paranoid: true,
  engine: 'MYISAM',
  indexes: [{
    name: 'pokedex_id_index',
    method: 'BTREE',
    fields: [ 'id' ]
  }, {
    name: 'search_index',
    type: 'FULLTEXT',
    fields: [ 'name', 'types' ]
  }],
  classMethods: {
    getByName(name) {
      return Pokemon.findOne({
        where: { name }
      });
    },
    search(params = {}) {
      let defaultParams = {
        offset: 0,
        count: 20,
        q: ''
      };
      deap.merge(params, defaultParams);
      if (typeof params.q !== 'string') {
        throw new HttpError('Search string cannot be an empty');
      }
      let q = params.q;
      let options = {
        where: {
          $or: {
            name: {
              $like: `%${q.trim()}%`
            },
            types: {
              $like: `%${q.trim()}%`
            },
            id: q.trim()
          }
        },
        order: [ 'id' ],
        limit: params.count,
        offset: params.offset
      };
      return Pokemon.findAndCountAll(options);
    }
  }
});

export default Pokemon;
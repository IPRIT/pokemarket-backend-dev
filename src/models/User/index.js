import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import userGroups from './userGroups';

let User = sequelize.define('User', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
    validate: {
      // a) allows words where first and last symbols are always alphanumeric;
      // b) allow to use underscores, points & hyphens no more then 1 time in a row
      is: /^[a-zA-Z0-9](?:[a-zA-Z0-9]*[_\.-]{0,1}[a-zA-Z0-9]+)+[a-zA-Z0-9]$/i
    }
  },
  googleId: {
    type: Sequelize.STRING,
    allowNull: true
  },
  facebookId: {
    type: Sequelize.BIGINT,
    allowNull: true
  },
  isBan: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  reputation: {
    type: Sequelize.INTEGER,
    defaultValue: 100
  },
  accessGroup: {
    type: Sequelize.INTEGER,
    defaultValue: userGroups.groups.user.mask,
    get: function () {
      let mask = this.getDataValue('accessGroup');
      if (this.getDataValue('isBan')) {
        mask = userGroups.groups.locked.mask;
      }
      return userGroups.utils.groupByMask(mask);
    }
  }
}, {
  getterMethods: {
    fullname: function () {
      let placeholder = '{firstname} {lastname}';
      return ['firstname', 'lastname'].reduce((placeholder, key) => {
        let regexp = new RegExp(`\{${key}\}`, 'gi');
        return placeholder.replace(regexp, this[ key ]);
      }, placeholder);
    }
  },
  setterMethods: {
    fullname: function (value) {
      var names = (value || "").trim().split(/\s+/);
      while (names.length !== 2) {
        names.push('-');
      }
      this.setDataValue('firstname', names.slice(0, -1).join(' '));
      this.setDataValue('lastname', names.slice(-1).join(' '));
    }
  },
  paranoid: true,

  engine: 'MYISAM',

  indexes: [{
    name: 'social_profiles_index',
    method: 'BTREE',
    fields: [ 'googleId', 'facebookId' ]
  }],
  defaultScope: function () {
    let lockedGroup = userGroups.groups.locked;
    return {
      where: {
        $and: {
          isBan: false,
          accessGroup: {
            $ne: lockedGroup.mask
          }
        }
      }
    };
  },
  scopes: {
    deleted: {
      where: {
        deletedAt: {
          $ne: null
        }
      }
    },
    banned: {
      where: {
        isBan: true
      }
    },
    accessGroup: function (...args) {
      let groups = args.map(group => userGroups.utils.resolveGroup(group));
      return {
        where: {
          accessGroup: {
            $in: groups.map(group => group.mask)
          }
        }
      }
    }
  }
});

export default User;
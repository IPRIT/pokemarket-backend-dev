import { User } from './models';
import userGroups from "./models/User/userGroups";

let curTime = new Date().getTime();
User.scope({method: ['accessGroup', 'user']}).findAll({
  order: [
    [ 'createdAt', 'asc' ]
  ],
  where: {
    createdAt: {
      $lt: new Date(new Date() - 1000 * 60 * 16)
    }
  },
  limit: 1
}).then(users => {
  console.log(users.length, new Date().getTime() - curTime);
}).catch(err => {
  console.log(err && err.errors && err.errors[0].path || err);
});

export default {};

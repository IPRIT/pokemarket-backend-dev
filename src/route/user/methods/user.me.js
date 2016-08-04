import { filterEntity as filter } from '../../../utils';

export default function (req, res, next) {
  let user = req.user;
  let queryParams = req.query;
  let fields = validateFields(queryParams.fields);

  res.json(filter(
    user.get({ plain: true }),
    { include: fields, exclude: [ 'updatedAt', 'createdAt', 'isBan', 'email' ] }
  ));
}

function validateFields(fields) {
  if (typeof fields !== 'string') {
    return [];
  }
  let validateRegexp = /^(?:\w+\,?)+\w+$/i;
  if (!validateRegexp.test(fields.trim())) {
    return [];
  }
  return fields.split(',');
}
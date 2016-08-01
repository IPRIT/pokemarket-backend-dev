import userGroups from './../models/User/userGroups';

export default (...groups) => {
  return (req, res, next) => {
    req.rightsMask = userGroups.utils.grouping(...groups);
    next();
  };
}
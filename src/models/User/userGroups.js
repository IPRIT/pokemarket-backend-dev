const groups = {
  admin: {
    mask: 0x1000,
    name: 'Admin'
  },
  user: {
    mask: 0x100,
    name: 'User'
  },
  locked: {
    mask: 0x10,
    name: 'Locked'
  }
};

let utils = {
  resolveGroup: group => group.mask ? group : Number.isInteger(group) ? utils.groupByMask(group) : groups[ group ],

  hasRight: (group, mask) => (mask & utils.resolveGroup( group ).mask) === utils.resolveGroup( group ).mask,
  
  grouping: (...groups) => groups.reduce((mask, group) => mask | utils.resolveGroup( group ).mask, 0),

  addGroup: (mask, group) => mask | utils.resolveGroup( group ).mask,

  removeGroup: (mask, group) => mask ^ utils.resolveGroup( group ).mask,
  
  groupByMask: mask => {
    let filteredGroups = utils.groupsByMask(mask);
    if (!filteredGroups.length) {
      throw new Error('Group not found');
    }
    return filteredGroups[0];
  },
  
  groupsByMask: mask => Object.keys(groups)
    .filter(groupKey => utils.hasRight(groupKey, mask))
    .map(groupKey => groups[ groupKey ]),
  
  groupsByMaskSorted: (mask, order = 'desc') => {
    let sign = order === 'desc' ? -1 : 1;
    return utils.groupsByMask(mask)
      .sort((a, b) => sign * (a.mask - b.mask));
  },
  
  maxGroupByMask: mask => {
    let filteredGroups = utils.groupsByMaskSorted(mask);
    if (!filteredGroups.length) {
      throw new Error('Group not found');
    }
    return filteredGroups[0];
  },
  
  minGroupByMask: mask => {
    let filteredGroups = utils.groupsByMaskSorted(mask, 'asc');
    if (!filteredGroups.length) {
      throw new Error('Group not found');
    }
    return filteredGroups[0];
  }
};

export default { groups, utils };
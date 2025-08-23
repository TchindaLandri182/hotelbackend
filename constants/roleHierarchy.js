const roleHierarchy = {
    admin: 0,
    nationalAgent: 1,
    regionAgent: 2,
    cityAgent: 3,
    zoneAgent: 4,
    hotelDirector: 5,
    hotelManager: 6,
    restaurantManager: 6,
    beveragesManager: 6,
    owner: 7
  };
  
  // Check if manager can manage target user
  exports.canManage = (managerRole, targetRole) => {
    const managerLevel = roleHierarchy[managerRole];
    const targetLevel = roleHierarchy[targetRole];
    
    if (managerLevel === undefined || targetLevel === undefined) 
      return false;
    
    return managerLevel < targetLevel;
  };
  
  // Check if inviter can invite the specified role
  exports.canInvite = (inviterRole, inviteeRole) => {
    return this.canManage(inviterRole, inviteeRole);
  };
  
  // Check if assigner can assign the specified role
  exports.canAssignRole = (assignerRole, targetRole) => {
    return this.canManage(assignerRole, targetRole);
  };
  
  // Get roles that a user can manage
  exports.getManageableRoles = (userRole) => {
    const userLevel = roleHierarchy[userRole];
    if (userLevel === undefined) return [];
    
    return Object.entries(roleHierarchy)
      .filter(([_, level]) => level > userLevel)
      .map(([role]) => role);
  };
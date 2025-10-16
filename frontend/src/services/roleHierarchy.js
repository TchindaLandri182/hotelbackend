const roleHierarchy = {
    admin: 0,
    nationalAgent: 1,
    regionAgent: 2,
    cityAgent: 3,
    zoneAgent: 4,
    owner: 5,
    hotelDirector: 6,
    hotelManager: 7,
    restaurantManager: 7,
    beveragesManager: 7,
  };
  
  // Check if manager can manage target user
  export const canManage = (managerRole, targetRole) => {
    const managerLevel = roleHierarchy[managerRole];
    const targetLevel = roleHierarchy[targetRole];
    
    if (managerLevel === undefined || targetLevel === undefined) 
      return false;
    
    return managerLevel < targetLevel;
  };
  
  // Check if inviter can invite the specified role
  export const canInvite = (inviterRole, inviteeRole) => {
    return this.canManage(inviterRole, inviteeRole);
  };
  
  // Check if assigner can assign the specified role
  export const canAssignRole = (assignerRole, targetRole) => {
    return this.canManage(assignerRole, targetRole);
  };
  
  // Get roles that a user can manage
  export const getManageableRoles = (userRole) => {
    const userLevel = roleHierarchy[userRole];
    if (userLevel === undefined) return [];
    
    return Object.entries(roleHierarchy)
      .filter(([_, level]) => level > userLevel)
      .map(([role]) => role);
  };

export default roleHierarchy
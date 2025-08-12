const permissions = {
    // CategoryRoom permissions
    createCategoryRoom: 1001,
    readCategoryRoom: 1002,
    updateCategoryRoom: 1003,
    deleteCategoryRoom: 1004,
  
    // Client permissions
    createClient: 2001,
    readClient: 2002,
    updateClient: 2003,
    deleteClient: 2004,
  
    // FoodItem permissions
    createFoodItem: 3001,
    readFoodItem: 3002,
    updateFoodItem: 3003,
    deleteFoodItem: 3004,
  
    // Hotel permissions
    createHotel: 4001,
    readHotel: 4002,
    updateHotel: 4003,
    deleteHotel: 4004,
  
    // Invoice permissions
    createInvoice: 5001,
    readInvoice: 5002,
    updateInvoice: 5003,
    deleteInvoice: 5004,
  
    // OrderItem permissions
    createOrderItem: 6001,
    readOrderItem: 6002,
    updateOrderItem: 6003,
    deleteOrderItem: 6004,
  
    // PricePeriod permissions
    createPricePeriod: 7001,
    readPricePeriod: 7002,
    updatePricePeriod: 7003,
    deletePricePeriod: 7004,
  
    // Room permissions
    createRoom: 8001,
    readRoom: 8002,
    updateRoom: 8003,
    deleteRoom: 8004,
  
    // Stay permissions
    createStay: 9001,
    readStay: 9002,
    updateStay: 9003,
    deleteStay: 9004,
  
    // User permissions
    createUser: 1101,
    readUser: 1102,
    updateUser: 1103,
    deleteUser: 1104,
  
    // Beverage permissions
    createBeverage: 1201,
    readBeverage: 1202,
    updateBeverage: 1203,
    deleteBeverage: 1204,
  
    // OrderBeverage permissions
    createOrderBeverage: 1301,
    readOrderBeverage: 1302,
    updateOrderBeverage: 1303,
    deleteOrderBeverage: 1304,
  
    // Location permissions (Country/Region/City/Zone)
    createLocation: 1401,
    readLocation: 1402,
    updateLocation: 1403,
    deleteLocation: 1404,
  
    // Notification permissions
    createNotification: 1501,
    readNotification: 1502,
    updateNotification: 1503,
    deleteNotification: 1504,
  
    // Log permissions
    readLog: 1601,
    deleteLog: 1602,
  
    // Special permissions
    managePermissions: 1701,
    accessReports: 1702,
    overrideRestrictions: 1703,
    systemConfiguration: 1704,
    inviteUser: 1705,

    // Zone permissions
    createZone: 1801,
    readZone: 1802,
    updateZone: 1803,
    deleteZone: 1804
};

module.exports = permissions;
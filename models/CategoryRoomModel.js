const mongoose = require('mongoose')

const CategoryRoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  description: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  basePrice: { type: Number, min: 0 },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date } // For offline sync
}, { timestamps: true });

module.exports = mongoose.model('CategoryRoom', CategoryRoomSchema)

// to the project you will add RoomCategorieList page(statistics dashboard, filtering options including search, sort by field, date range, 2 different table views: overview, detail(add number of room per categorie, average occupance rate, revenue), pagination support), add RoomCategorieForm it should support both create and edit mode, add RoomList page(statistics dashboard, filtering options, 2 different table views: overview( add know if actually occupy or reserved or ...) and detail(add average occupance rate, the number of night occupied, the number of times stayed, the average occupancy rate, the revenue), pagination support), add RoomForm, add Client List and add ClientForm
// const CategoryRoomSchema = new mongoose.Schema({
//     hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
//     name: { type: String, required: true },
//     description: { type: String },
//     basePrice: { type: Number, required: true },
//     deleted: { type: Boolean, default: false},
//     createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
//    }, { timestamps: true }); this is the schema of room category do the controller and the routes for this schema it should contian a route to update(here only an admin, the hotel owner and the a room manager can update), delete(here only an admin and hotel owner can delete a hotel), create(only admin and hotel owner can create), get all room categories, get a single room categorie and get room caterogies( hier we have pagination, sort, order, search, type if the type have overview as value then to the room categories information add the number of rooms else if the type is details add the available, occupied , total number of room base on the reservation, stay and room also add the occupacy rate, the number of stay and revenue ) 
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import hotelReducer from './slices/hotelSlice'
import roomReducer from './slices/roomSlice'
import clientReducer from './slices/clientSlice'
import stayReducer from './slices/staySlice'
import invoiceReducer from './slices/invoiceSlice'
import foodItemReducer from './slices/foodItemSlice'
import orderItemReducer from './slices/orderItemSlice'
import locationReducer from './slices/locationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    rooms: roomReducer,
    clients: clientReducer,
    stays: stayReducer,
    invoices: invoiceReducer,
    foodItems: foodItemReducer,
    orderItems: orderItemReducer,
    locations: locationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// export type RootState = ReturnType/*<typeof store.getState>*/
// export type AppDispatch = typeof store.dispatch
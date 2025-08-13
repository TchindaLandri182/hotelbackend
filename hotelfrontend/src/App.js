import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import VerifyEmail from './pages/Auth/VerifyEmail';
import CompleteProfile from './pages/Auth/CompleteProfile';
import Dashboard from './pages/Dashboard/Dashboard';
import Hotels from './pages/Hotels/Hotels';
import HotelForm from './pages/Hotels/HotelForm';
import Rooms from './pages/Rooms/Rooms';
import RoomForm from './pages/Rooms/RoomForm';
import Categories from './pages/Categories/Categories';
import CategoryForm from './pages/Categories/CategoryForm';
import Clients from './pages/Clients/Clients';
import ClientForm from './pages/Clients/ClientForm';
import Stays from './pages/Stays/Stays';
import StayForm from './pages/Stays/StayForm';
import Invoices from './pages/Invoices/Invoices';
import InvoiceForm from './pages/Invoices/InvoiceForm';
import FoodItems from './pages/FoodItems/FoodItems';
import FoodItemForm from './pages/FoodItems/FoodItemForm';
import OrderItems from './pages/OrderItems/OrderItems';
import OrderItemForm from './pages/OrderItems/OrderItemForm';
import PricePeriods from './pages/PricePeriods/PricePeriods';
import PricePeriodForm from './pages/PricePeriods/PricePeriodForm';
import Zones from './pages/Zones/Zones';
import ZoneForm from './pages/Zones/ZoneForm';
import Regions from './pages/Regions/Regions';
import RegionForm from './pages/Regions/RegionForm';
import Cities from './pages/Cities/Cities';
import CityForm from './pages/Cities/CityForm';
import Countries from './pages/Countries/Countries';
import CountryForm from './pages/Countries/CountryForm';
import Users from './pages/Users/Users';
import UserForm from './pages/Users/UserForm';
import Permissions from './pages/Permissions/Permissions';
import Settings from './pages/Settings/Settings';
import UserGuide from './pages/UserGuide/UserGuide';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Hotel Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <CookiesProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Hotels */}
                  <Route path="hotels" element={<Hotels />} />
                  <Route path="hotels/create" element={<HotelForm />} />
                  <Route path="hotels/edit/:id" element={<HotelForm />} />
                  
                  {/* Rooms */}
                  <Route path="rooms" element={<Rooms />} />
                  <Route path="rooms/create" element={<RoomForm />} />
                  <Route path="rooms/edit/:id" element={<RoomForm />} />
                  
                  {/* Categories */}
                  <Route path="categories" element={<Categories />} />
                  <Route path="categories/create" element={<CategoryForm />} />
                  <Route path="categories/edit/:id" element={<CategoryForm />} />
                  
                  {/* Clients */}
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/create" element={<ClientForm />} />
                  <Route path="clients/edit/:id" element={<ClientForm />} />
                  
                  {/* Stays */}
                  <Route path="stays" element={<Stays />} />
                  <Route path="stays/create" element={<StayForm />} />
                  <Route path="stays/edit/:id" element={<StayForm />} />
                  
                  {/* Invoices */}
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="invoices/create" element={<InvoiceForm />} />
                  <Route path="invoices/edit/:id" element={<InvoiceForm />} />
                  
                  {/* Food Items */}
                  <Route path="food-items" element={<FoodItems />} />
                  <Route path="food-items/create" element={<FoodItemForm />} />
                  <Route path="food-items/edit/:id" element={<FoodItemForm />} />
                  
                  {/* Order Items */}
                  <Route path="order-items" element={<OrderItems />} />
                  <Route path="order-items/create" element={<OrderItemForm />} />
                  <Route path="order-items/edit/:id" element={<OrderItemForm />} />
                  
                  {/* Price Periods */}
                  <Route path="price-periods" element={<PricePeriods />} />
                  <Route path="price-periods/create" element={<PricePeriodForm />} />
                  <Route path="price-periods/edit/:id" element={<PricePeriodForm />} />
                  
                  {/* Zones */}
                  <Route path="zones" element={<Zones />} />
                  <Route path="zones/create" element={<ZoneForm />} />
                  <Route path="zones/edit/:id" element={<ZoneForm />} />
                  
                  {/* Regions */}
                  <Route path="regions" element={<Regions />} />
                  <Route path="regions/create" element={<RegionForm />} />
                  <Route path="regions/edit/:id" element={<RegionForm />} />
                  
                  {/* Cities */}
                  <Route path="cities" element={<Cities />} />
                  <Route path="cities/create" element={<CityForm />} />
                  <Route path="cities/edit/:id" element={<CityForm />} />
                  
                  {/* Countries */}
                  <Route path="countries" element={<Countries />} />
                  <Route path="countries/create" element={<CountryForm />} />
                  <Route path="countries/edit/:id" element={<CountryForm />} />
                  
                  {/* Users */}
                  <Route path="users" element={<Users />} />
                  <Route path="users/create" element={<UserForm />} />
                  <Route path="users/edit/:id" element={<UserForm />} />
                  
                  {/* Permissions */}
                  <Route path="permissions" element={<Permissions />} />
                  
                  {/* Settings */}
                  <Route path="settings" element={<Settings />} />
                  
                  {/* User Guide */}
                  <Route path="user-guide" element={<UserGuide />} />
                }
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
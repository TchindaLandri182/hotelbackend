import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Layout Components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Public Pages
import Home from './pages/Home/Home'
import About from './pages/About/About'

// Auth Pages
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import VerifyEmail from './pages/Auth/VerifyEmail'
import CompleteProfile from './pages/Auth/CompleteProfile'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import SignupInvite from './pages/Auth/SignupInvite'

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard'
import Hotels from './pages/Hotels/Hotels'
import HotelForm from './pages/Hotels/HotelForm'
import Rooms from './pages/Rooms/Rooms'
import RoomForm from './pages/Rooms/RoomForm'
import Categories from './pages/Categories/Categories'
import CategoryForm from './pages/Categories/CategoryForm'
import Clients from './pages/Clients/Clients'
import ClientForm from './pages/Clients/ClientForm'
import Stays from './pages/Stays/Stays'
import StayForm from './pages/Stays/StayForm'
import Invoices from './pages/Invoices/Invoices'
import InvoiceForm from './pages/Invoices/InvoiceForm'
import FoodItems from './pages/FoodItems/FoodItems'
import FoodItemForm from './pages/FoodItems/FoodItemForm'
import OrderItems from './pages/OrderItems/OrderItems'
import OrderItemForm from './pages/OrderItems/OrderItemForm'
import PricePeriods from './pages/PricePeriods/PricePeriods'
import PricePeriodForm from './pages/PricePeriods/PricePeriodForm'
import Zones from './pages/Zones/Zones'
import ZoneForm from './pages/Zones/ZoneForm'
import Regions from './pages/Regions/Regions'
import RegionForm from './pages/Regions/RegionForm'
import Cities from './pages/Cities/Cities'
import CityForm from './pages/Cities/CityForm'
import Countries from './pages/Countries/Countries'
import CountryForm from './pages/Countries/CountryForm'
import Users from './pages/Users/Users'
import UserForm from './pages/Users/UserForm'
import Permissions from './pages/Permissions/Permissions'
import Settings from './pages/Settings/Settings'
import UserGuide from './pages/UserGuide/UserGuide'
import Reports from './pages/Reports/Reports'
import Calendar from './pages/Calendar/Calendar'
import InvoicePDF from './components/PDF/InvoicePDF'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Loading Hotel Management System...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            Please wait while we prepare your workspace
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup/invite" element={<SignupInvite />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route path="invoices/pdf" element={<InvoicePDF />} />
      
      {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
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

        {/*<Route path="police/pdf" element={<PolicePD />} />*/}
        
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

        {/* Calendar */}
        <Route path="calendar" element={<Calendar />} />
        
        {/* Reports */}
        <Route path="reports" element={<Reports />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        
        {/* User Guide */}
        <Route path="user-guide" element={<UserGuide />} />
      </Route>
      
      {/* Redirect authenticated users to dashboard */}
      {/*<Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />*/}
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
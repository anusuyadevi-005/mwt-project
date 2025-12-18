import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import pages
import HomePage from './pages/page.jsx'
import LoginPage from './pages/login/page.jsx'
import SignupPage from './pages/signup/page.jsx'
import ForgotPasswordPage from './pages/forgot-password/page.jsx'
import ResetPasswordPage from './pages/reset-password/page.jsx'
import PackagesPage from './pages/packages/page.jsx'
import PackageDetailsPage from './pages/packages/[id]/page.jsx'
import BookingPage from './pages/booking/page.jsx'
import VehiclesPage from './pages/vehicles/page.jsx'
import GuidesPage from './pages/guides/page.jsx'
import ContactPage from './pages/contact/page.jsx'
import AdminPage from './pages/admin/page.jsx'

// Import components and providers
import Navbar from './components/navbar.jsx'
import { AuthProvider } from './context/auth-context.jsx'
import { ThemeProvider } from './context/theme-context.jsx'
import { LanguageProvider } from './context/language-context.jsx'

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/packages/:id" element={<PackageDetailsPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  )
}

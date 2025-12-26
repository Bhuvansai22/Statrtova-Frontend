import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './components/AuthPage';
import AboutUs from './pages/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';

// Startup Pages
import StartupDashboard from './pages/startup/StartupDashboard';
import CompanyProfile from './pages/startup/CompanyProfile';
import FinancialDocuments from './pages/startup/FinancialDocuments';
import FuturePlans from './pages/startup/FuturePlans';


// Investor Pages
import InvestorDashboard from './pages/investor/InvestorDashboard';
import BrowseStartups from './pages/investor/BrowseStartups';
import StartupDetails from './pages/investor/StartupDetails';
import Watchlist from './pages/investor/Watchlist';
import InvestorProfile from './pages/investor/InvestorProfile';
import Messages from './pages/common/Messages';


function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user?.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard'} /> : <AuthPage />
      } />
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to={user?.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard'} /> : <AuthPage />
      } />
      <Route path="/about" element={<AboutUs />} />

      {/* Startup Routes */}
      <Route path="/startup/dashboard" element={
        <ProtectedRoute allowedRoles={['startup']}>
          <StartupDashboard />
        </ProtectedRoute>
      } />
      <Route path="/startup/profile" element={
        <ProtectedRoute allowedRoles={['startup']}>
          <CompanyProfile />
        </ProtectedRoute>
      } />
      <Route path="/startup/financial-documents" element={
        <ProtectedRoute allowedRoles={['startup']}>
          <FinancialDocuments />
        </ProtectedRoute>
      } />
      <Route path="/startup/future-plans" element={
        <ProtectedRoute allowedRoles={['startup']}>
          <FuturePlans />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />

      {/* Investor Routes */}
      <Route path="/investor/dashboard" element={
        <ProtectedRoute allowedRoles={['investor']}>
          <InvestorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/investor/browse" element={
        <ProtectedRoute allowedRoles={['investor']}>
          <BrowseStartups />
        </ProtectedRoute>
      } />
      <Route path="/investor/startup/:id" element={
        <ProtectedRoute allowedRoles={['investor']}>
          <StartupDetails />
        </ProtectedRoute>
      } />
      <Route path="/investor/watchlist" element={
        <ProtectedRoute allowedRoles={['investor']}>
          <Watchlist />
        </ProtectedRoute>
      } />
      <Route path="/investor/profile" element={
        <ProtectedRoute allowedRoles={['investor']}>
          <InvestorProfile />
        </ProtectedRoute>
      } />

      {/* 404  */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
            <p className="text-xl text-gray-600">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;

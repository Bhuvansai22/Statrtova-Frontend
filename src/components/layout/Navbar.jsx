import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        return user.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffc107' }}>
                            <span className="font-bold text-xl" style={{ color: '#1e3a5f' }}>S</span>
                        </div>
                        <span className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>STARTOVA</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="font-medium transition-colors"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    Dashboard
                                </Link>
                                <span style={{ color: '#6b7280' }}>
                                    {user?.username || user?.email}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-semibold capitalize" style={{ backgroundColor: '#e8f4f8', color: '#1e3a5f' }}>
                                    {user?.role}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary px-4 py-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/about"
                                    className="font-medium transition-colors"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    className="font-medium transition-colors"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn btn-primary px-6 py-2"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <XMarkIcon className="h-6 w-6" style={{ color: '#1e3a5f' }} />
                        ) : (
                            <Bars3Icon className="h-6 w-6" style={{ color: '#1e3a5f' }} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-4 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="pb-3 border-b border-gray-200">
                                    <p className="text-gray-600 text-sm">{user?.email}</p>
                                    <span className="badge badge-primary capitalize mt-1">
                                        {user?.role}
                                    </span>
                                </div>
                                <Link
                                    to={getDashboardLink()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 font-medium"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/messages"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 font-medium"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    Messages
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full btn btn-secondary"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 font-medium"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 font-medium"
                                    style={{ color: '#1e3a5f' }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn btn-primary w-full"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

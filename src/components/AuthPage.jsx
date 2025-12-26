import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const isLoginPage = location.pathname === '/login';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'startup'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLoginPage) {
                const result = await login(formData.email, formData.password);

                if (!result.success) {
                    throw new Error(result.error);
                }

                toast.success('Welcome back!');
                const dashboardPath = result.user.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard';
                navigate(dashboardPath);
            } else {
                const result = await signup(formData);

                // Check if signup was successful
                if (!result.success) {
                    throw new Error(result.error);
                }

                toast.success('Account created successfully!');
                const dashboardPath = result.user.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard';
                navigate(dashboardPath);
            }
        } catch (error) {
            toast.error(error.message || (isLoginPage ? 'Login failed' : 'Signup failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e9f5 100%)' }}>
            {/* Organic Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full opacity-40 -ml-40 -mb-40"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffc107' }}>
                                    <span className="font-bold text-2xl" style={{ color: '#1e3a5f' }}>S</span>
                                </div>
                                <span className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>STARTOVA</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1e3a5f' }}>
                            {isLoginPage ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-600">
                            {isLoginPage ? 'Sign in to continue' : 'Join STARTOVA today'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username (signup only) */}
                        {!isLoginPage && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    required
                                    className="input"
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="input"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                required
                                className="input pr-12"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Role Selection (signup only) */}
                        {!isLoginPage && (
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                    I am a
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'startup' }))}
                                        className={`p-3 rounded-lg font-medium transition-all ${formData.role === 'startup'
                                            ? 'shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        style={formData.role === 'startup' ? { backgroundColor: '#ffc107', color: '#1e3a5f' } : { color: '#1e3a5f' }}
                                    >
                                        Startup
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'investor' }))}
                                        className={`p-3 rounded-lg font-medium transition-all ${formData.role === 'investor'
                                            ? 'shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        style={formData.role === 'investor' ? { backgroundColor: '#ffc107', color: '#1e3a5f' } : { color: '#1e3a5f' }}
                                    >
                                        Investor
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isLoginPage ? 'Log In' : 'Sign Up')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Toggle between Login/Signup */}
                    <div className="text-center">
                        <p className="text-gray-600">
                            {isLoginPage ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <Link
                            to={isLoginPage ? '/signup' : '/login'}
                            className="font-semibold hover:underline mt-1 inline-block"
                            style={{ color: '#1e3a5f' }}
                        >
                            {isLoginPage ? 'Create new account' : 'Log in'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

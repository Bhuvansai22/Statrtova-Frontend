import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import { MagnifyingGlassIcon, StarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const InvestorDashboard = () => {
    const { user } = useAuth();

    const quickLinks = [
        {
            title: 'Browse Startups',
            description: 'Discover innovative startups',
            icon: MagnifyingGlassIcon,
            link: '/investor/browse',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'My Watchlist',
            description: 'View saved startups',
            icon: StarIcon,
            link: '/investor/watchlist',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'My Profile',
            description: 'Manage your investor profile',
            icon: BuildingOfficeIcon,
            link: '/investor/profile',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-glass p-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome, {user?.username || 'Investor'}! 👋
                        </h1>
                        <p className="text-xl text-gray-600">
                            Discover your next investment opportunity
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {quickLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.link}
                                    className="card hover-lift group"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <link.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {link.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {link.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InvestorDashboard;

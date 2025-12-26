import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { startupAPI, messageAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    LightBulbIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const StartupDashboard = () => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [stats, setStats] = useState({
        messages: 0,
        documents: 0,
        plans: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch all startups and find the one belonging to this user
            const response = await startupAPI.getAll();
            const userStartup = response.data.find(s => s.userId === user.id || s.userId === user._id);

            if (userStartup) {
                setStartup(userStartup);

                // Fetch messages
                const messagesRes = await messageAPI.getStartupMessages(userStartup._id);

                setStats({
                    messages: messagesRes.data.length || 0,
                    documents: userStartup.financialDocuments?.length || 0,
                    plans: userStartup.pitchIdeas?.length || 0
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </Layout>
        );
    }

    const quickLinks = [
        {
            title: 'Company Profile',
            description: 'Manage your company information',
            icon: BuildingOfficeIcon,
            link: '/startup/profile',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Financial Documents',
            description: 'Upload and manage financial statements',
            icon: DocumentTextIcon,
            link: '/startup/financial-documents',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Future Plans',
            description: 'Add your pitch ideas and future strategies',
            icon: LightBulbIcon,
            link: '/startup/future-plans',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="card-glass p-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back! 👋
                        </h1>
                        <p className="text-xl text-gray-600">
                            {startup ? `Managing ${startup.startupName}` : 'Complete your profile to get started'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link to="/messages" className="card hover-lift block">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Messages</p>
                                    <p className="text-3xl font-bold gradient-text">{stats.messages}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center">
                                    <EnvelopeIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Link>

                        <Link to="/startup/financial-documents" className="card hover-lift block">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Documents</p>
                                    <p className="text-3xl font-bold gradient-text">{stats.documents}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                    <DocumentTextIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Link>

                        <Link to="/startup/future-plans" className="card hover-lift block">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Pitch Ideas</p>
                                    <p className="text-3xl font-bold gradient-text">{stats.plans}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                    <LightBulbIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Actions */}
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

                    {/* Profile Completion Prompt */}
                    {!startup && (
                        <div className="mt-8 card-glass p-6 border-l-4 border-primary-500">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Complete Your Profile
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Set up your company profile to start attracting investors
                            </p>
                            <Link to="/startup/profile" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StartupDashboard;

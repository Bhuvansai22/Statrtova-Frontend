import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const LandingPage = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-screen bg-white overflow-hidden">
                {/* Organic Background Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-[300px] opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-[250px]"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-40"></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: '#1e3a5f' }}>
                                Build Smart.
                                <br />
                                <span style={{ color: '#1e3a5f' }}>Pitch Bold. Scale Fast.</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                                Connect visionary startups with forward-thinking investors.
                                STARTOVA provides a transparent platform to showcase your company data,
                                financials, future plans, and innovative ideas to the right investors.
                            </p>

                            <Link
                                to="/signup"
                                className="inline-block px-8 py-4 text-lg font-semibold rounded-full transition-all hover:shadow-lg hover:-translate-y-1"
                                style={{ backgroundColor: '#ffc107', color: '#1e3a5f' }}
                            >
                                GET STARTED
                            </Link>
                        </motion.div>

                        {/* Right Column - Illustration Area */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            {/* Placeholder for illustration - using simple shapes */}
                            <div className="relative w-full h-[500px]">
                                {/* Laptop/Screen representation */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-60 bg-gray-200 rounded-lg shadow-xl border-8 border-gray-300">
                                    <div className="w-full h-full bg-white rounded flex items-center justify-center">
                                        {/* Charts representation */}
                                        <div className="flex space-x-2 items-end">
                                            <div className="w-12 h-24 bg-gradient-to-t from-green-400 to-green-300 rounded-t"></div>
                                            <div className="w-12 h-32 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t"></div>
                                            <div className="w-12 h-20 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t"></div>
                                            <div className="w-12 h-28 bg-gradient-to-t from-purple-400 to-purple-300 rounded-t"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rocket icon */}
                                <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center transform -rotate-45">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white"></div>
                                </div>

                                {/* Coins stack */}
                                <div className="absolute bottom-16 left-8">
                                    <div className="w-8 h-3 bg-yellow-400 rounded-full mb-1"></div>
                                    <div className="w-8 h-3 bg-yellow-300 rounded-full mb-1"></div>
                                    <div className="w-8 h-3 bg-yellow-400 rounded-full"></div>
                                </div>

                                {/* Clock */}
                                <div className="absolute bottom-8 right-8 w-16 h-16 bg-green-400 rounded-full border-4 border-green-500 flex items-center justify-center">
                                    <div className="absolute w-1 h-5 bg-green-800 origin-bottom" style={{ transform: 'rotate(90deg)' }}></div>
                                    <div className="absolute w-1 h-3 bg-green-800 origin-bottom" style={{ transform: 'rotate(0deg)' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
                            Why Choose STARTOVA
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to connect startups with investors
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'For Startups',
                                description: 'Showcase your vision, financials, and growth plans to attract the right investors.',
                                color: '#4a90e2'
                            },
                            {
                                title: 'For Investors',
                                description: 'Discover promising startups, analyze data, and build your portfolio with confidence.',
                                color: '#ffc107'
                            },
                            {
                                title: 'Direct Connect',
                                description: 'Seamless communication between startups and investors for better partnerships.',
                                color: '#66bb6a'
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                            >
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: feature.color + '20' }}
                                >
                                    <div
                                        className="w-7 h-7 rounded-full"
                                        style={{ backgroundColor: feature.color }}
                                    ></div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3" style={{ color: '#1e3a5f' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { label: 'Active Startups', value: '0', color: '#4a90e2' },
                            { label: 'Investors', value: '0', color: '#ffc107' },
                            { label: 'Funded Projects', value: '0', color: '#66bb6a' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className="text-5xl font-bold mb-2" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 text-lg">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#e8f4f8' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200 rounded-full opacity-30 -ml-24 -mb-24"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1e3a5f' }}>
                        Ready to Transform Your Future?
                    </h2>
                    <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                        Join STARTOVA today and connect with the perfect partners for your entrepreneurial journey
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-5 text-lg font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
                        style={{ backgroundColor: '#ffc107', color: '#1e3a5f' }}
                    >
                        Start Your Journey
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default LandingPage;

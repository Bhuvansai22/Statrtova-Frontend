import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const AboutUs = () => {
    return (
        <Layout>
            <div className="bg-white min-h-screen">
                {/* Hero Section */}
                <section className="py-20 relative overflow-hidden bg-gray-900 text-white">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full opacity-20 -ml-20 -mb-20 blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            About STARTOVA
                        </motion.h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Bridging the gap between ambitious startups and visionary investors.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    At STARTOVA, we believe that great ideas deserve the chance to change the world. However, finding the right funding and mentorship can be the biggest hurdle for new entrepreneurs.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Our mission is to democratize access to capital and create a transparent, efficient ecosystem where startups can showcase their potential and investors can discover the next unicorn.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-2xl transform rotate-3"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Team collaboration"
                                    className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900">Core Values</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Innovation", desc: "We champion new ideas and creative problem-solving." },
                                { title: "Transparency", desc: "Building trust through clear, open communication and data." },
                                { title: "Community", desc: "Fostering a supportive network of founders and mentors." }
                            ].map((val, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-xl shadow-sm text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{val.title}</h3>
                                    <p className="text-gray-600">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default AboutUs;

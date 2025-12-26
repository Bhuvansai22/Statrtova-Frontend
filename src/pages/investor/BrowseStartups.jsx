import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { startupAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const BrowseStartups = () => {
    const [startups, setStartups] = useState([]);
    const [filteredStartups, setFilteredStartups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStartups();
    }, []);

    useEffect(() => {
        filterStartups();
    }, [searchTerm, selectedDomain, startups]);

    const fetchStartups = async () => {
        try {
            const response = await startupAPI.getAll();
            setStartups(response.data);
            setFilteredStartups(response.data);
        } catch (error) {
            toast.error('Failed to load startups');
        } finally {
            setLoading(false);
        }
    };

    const filterStartups = () => {
        let filtered = startups;

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedDomain) {
            filtered = filtered.filter(s => s.domain.toLowerCase() === selectedDomain.toLowerCase());
        }

        setFilteredStartups(filtered);
    };

    const domains = [...new Set(startups.map(s => s.domain))];

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Startups</h1>

                    {/* Filters */}
                    <div className="card mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Search startups..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="input"
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                            >
                                <option value="">All Domains</option>
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Startups Grid */}
                    {filteredStartups.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">No startups found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStartups.map(startup => (
                                <Link
                                    key={startup._id}
                                    to={`/investor/startup/${startup._id}`}
                                    className="card hover-lift"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{startup.startupName}</h3>
                                        <span className="badge badge-primary">{startup.domain}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {startup.description || 'No description available'}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>Founded: {startup.foundedYear || 'N/A'}</span>
                                        <span className="mx-2">•</span>
                                        <span>{startup.founderName}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default BrowseStartups;

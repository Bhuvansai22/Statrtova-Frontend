import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { watchlistAPI, investorAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

const Watchlist = () => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            // First get investor ID
            const { data: investorData } = await investorAPI.getAll({ email: user.email });
            if (investorData.length > 0) {
                const response = await watchlistAPI.getByInvestor(investorData[0]._id);
                setWatchlist(response.data);
            }
        } catch (error) {
            toast.error('Failed to load watchlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWatchlist = async (id) => {
        try {
            await watchlistAPI.remove(id);
            setWatchlist(watchlist.filter(item => item._id !== id));
            toast.success('Removed from watchlist');
        } catch (error) {
            toast.error('Failed to remove from watchlist');
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

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Watchlist</h1>

                    {watchlist.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray-500 mb-4">Your watchlist is empty</p>
                            <Link to="/investor/browse" className="btn btn-primary">
                                Browse Startups
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {watchlist.map(item => (
                                <div key={item._id} className="card flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900">{item.startupId?.startupName}</h3>
                                        <p className="text-gray-600 text-sm">{item.startupId?.description?.substring(0, 100)}...</p>
                                        <span className="badge badge-primary mt-2">{item.startupId?.domain}</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/investor/startup/${item.startupId?._id}`}
                                            className="btn btn-secondary"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => removeFromWatchlist(item._id)}
                                            className="btn btn-ghost text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Watchlist;

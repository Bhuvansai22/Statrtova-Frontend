import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { startupAPI, watchlistAPI, investorAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import { ChatBubbleLeftRightIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import ContactModal from '../../components/ContactModal';

const StartupDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [investorId, setInvestorId] = useState(null);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [watchlistId, setWatchlistId] = useState(null);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);


    useEffect(() => {
        if (id && user) {
            fetchStartupDetails();
        }
    }, [id, user]);

    const fetchStartupDetails = async () => {
        try {
            const response = await startupAPI.getById(id);
            setStartup(response.data);

            // Fetch investor ID and check watchlist status
            // Use roleDocumentId if available, otherwise fetch
            let currentInvestorId = user.roleDocumentId;

            if (!currentInvestorId) {
                const { data: investorData } = await investorAPI.getAll({ email: user.email });
                if (investorData.length > 0) {
                    currentInvestorId = investorData[0]._id;
                }
            }

            setInvestorId(currentInvestorId);

            if (currentInvestorId) {
                const statusRes = await watchlistAPI.checkStatus(currentInvestorId, id);
                setIsWatchlisted(statusRes.data.isWatchlisted);
                setWatchlistId(statusRes.data.watchlistId);
            }

        } catch (error) {
            console.error(error);
            toast.error('Failed to load startup details');
        } finally {
            setLoading(false);
        }
    };

    const handleWatchlistToggle = async () => {
        if (!investorId) {
            toast.error('Investor profile not found');
            return;
        }

        setWatchlistLoading(true);
        try {
            if (isWatchlisted) {
                await watchlistAPI.remove(watchlistId);
                setIsWatchlisted(false);
                setWatchlistId(null);
                toast.success('Removed from watchlist');
            } else {
                const res = await watchlistAPI.add({
                    investorId,
                    startupId: startup._id
                });
                setIsWatchlisted(true);
                setWatchlistId(res.data._id);
                toast.success('Added to watchlist');
            }
        } catch (error) {
            console.error(error);
            toast.error(isWatchlisted ? 'Failed to remove' : 'Failed to add');
        } finally {
            setWatchlistLoading(false);
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

    if (!startup) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Startup not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e3a5f' }}>{startup.startupName}</h1>
                                <p className="text-gray-600">Founded by {startup.founderName}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleWatchlistToggle}
                                    disabled={watchlistLoading}
                                    className={`btn flex items-center space-x-2 ${isWatchlisted
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'btn-secondary'
                                        }`}
                                >
                                    {isWatchlisted ? (
                                        <>
                                            <MinusCircleIcon className="h-5 w-5" />
                                            <span>Remove from Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircleIcon className="h-5 w-5" />
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="btn btn-primary flex items-center space-x-2"
                                >
                                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                    <span>Contact Founder</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Domain</p>
                                <p className="font-semibold capitalize">{startup.domain}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Founded</p>
                                <p className="font-semibold">{startup.foundedYear || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                            <p className="text-gray-600">{startup.description || 'No description available'}</p>
                        </div>

                        {startup.futurePlans && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Future Plans</h3>
                                <p className="text-gray-600">{startup.futurePlans}</p>
                            </div>
                        )}

                        {startup.pitchIdeas && startup.pitchIdeas.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Pitch Ideas</h3>
                                <div className="space-y-3">
                                    {startup.pitchIdeas.map((idea, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{idea.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Modal */}
                        <ContactModal
                            isOpen={isContactModalOpen}
                            onClose={() => setIsContactModalOpen(false)}
                            startupId={startup._id}
                            startupName={startup.startupName}
                            investorId={investorId}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StartupDetails;

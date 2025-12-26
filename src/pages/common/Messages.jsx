import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageAPI, investorAPI, startupAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import { CheckCircleIcon, EnvelopeIcon, TrashIcon } from '@heroicons/react/24/outline';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

    useEffect(() => {
        fetchMessages();
    }, [user, activeTab]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            let response;

            // Use the roleDocumentId from AuthContext directly
            // This relies on the previous fix we made to AuthController/Context
            const roleId = user.roleDocumentId;

            if (!roleId) {
                console.warn("No roleDocumentId found for message fetching");
                setLoading(false);
                return;
            }

            if (user.role === 'startup') {
                response = await messageAPI.getStartupMessages(roleId);
            } else if (user.role === 'investor') {
                response = await messageAPI.getInvestorMessages(roleId);
            } else {
                // Fallback for interns or others (using user ID directly if needed)
                // Assuming messageAPI might handle raw user IDs or we just ignore
                console.log("Messaging not fully supported for this role yet:", user.role);
                setMessages([]);
                return;
            }

            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await messageAPI.markAsRead(id);
            setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await messageAPI.delete(id);
            setMessages(messages.filter(m => m._id !== id));
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>Messages</h1>
                            {/* Tabs could be added here later */}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <EnvelopeIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-lg">No messages found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <MessageCard
                                        key={msg._id}
                                        msg={msg}
                                        onMarkRead={handleMarkRead}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Sub-component for individual message card with expand state
const MessageCard = ({ msg, onMarkRead, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`p-4 rounded-lg border transition-all cursor-pointer ${msg.status === 'read' ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200 shadow-sm'
                } ${expanded ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:shadow-md'}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg" style={{ color: '#1e3a5f' }}>{msg.subject}</h3>
                    <p className="text-sm text-gray-600">
                        From: <span className="font-medium">{msg.investorId?.name || msg.investorId?.email || 'Unknown'}</span>
                        {' • '}
                        <span className="text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {msg.status !== 'read' && (
                        <button
                            onClick={() => onMarkRead(msg._id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Mark as read"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(msg._id)}
                        className="p-1 text-red-400 hover:bg-red-50 rounded"
                        title="Delete"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Message Body - Truncated by default, expanded on click */}
            <div
                className={`text-gray-700 whitespace-pre-wrap transition-all duration-200 overflow-hidden ${expanded ? 'max-h-full' : 'max-h-16' // Approx 3 lines (1.5rem * 3 lines + padding)
                    }`}
            >
                {msg.message}
            </div>
            {!expanded && (
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-blue-500 font-medium hover:underline">Read more...</span>
                </div>
            )}
            {expanded && (
                <div className="flex justify-end mt-2">
                    <span className="text-xs text-blue-500 font-medium hover:underline">Show less</span>
                </div>
            )}
        </div>
    );
};


export default Messages;

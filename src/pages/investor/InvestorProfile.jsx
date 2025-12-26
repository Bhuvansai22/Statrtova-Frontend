import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { investorAPI, investmentAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

const InvestorProfile = () => {
    const { user } = useAuth();
    const [investor, setInvestor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        bio: '',
        company: '',
        designation: '',
        linkedinUrl: '',
        investmentRange: '',
        minInvestment: '',
        maxInvestment: '',
        preferredDomains: []
    });
    const [loading, setLoading] = useState(false);

    const domainOptions = ['fintech', 'edtech', 'healthtech', 'ecommerce', 'foodtech', 'transportation', 'hospitality', 'gaming', 'social commerce', 'quick commerce'];

    const [isEditing, setIsEditing] = useState(false);

    const fetchInvestor = useCallback(async () => {
        try {
            if (user?.roleDocumentId) {
                const response = await investorAPI.getById(user.roleDocumentId);
                const userInvestor = response.data;

                if (userInvestor) {
                    setInvestor(userInvestor);
                    setFormData({
                        name: userInvestor.name || '',
                        phone: userInvestor.phone || '',
                        location: userInvestor.location || '',
                        bio: userInvestor.bio || '',
                        company: userInvestor.company || '',
                        designation: userInvestor.designation || '',
                        linkedinUrl: userInvestor.linkedinUrl || '',
                        investmentRange: userInvestor.investmentRange || '',
                        minInvestment: userInvestor.minInvestment || 100000,
                        maxInvestment: userInvestor.maxInvestment || 10000000,
                        preferredDomains: userInvestor.preferredDomains || []
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching investor:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchInvestor();
    }, [fetchInvestor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!investor) return toast.error('Please create your investor profile first');

        setLoading(true);
        try {
            await investmentAPI.updateInvestorProfile(investor._id, formData);
            toast.success('Profile updated successfully!');
            fetchInvestor();
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const toggleDomain = (domain) => {
        setFormData(prev => ({
            ...prev,
            preferredDomains: prev.preferredDomains.includes(domain)
                ? prev.preferredDomains.filter(d => d !== domain)
                : [...prev.preferredDomains, domain]
        }));
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
                            Investor Profile
                        </h1>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="card bg-white shadow rounded-lg p-6">
                        {!isEditing ? (
                            // View Mode
                            <div className="space-y-8">
                                {/* Basic Info */}
                                <div className="border-b pb-6">
                                    <h2 className="text-2xl font-bold mb-2">{formData.name || 'Your Name'}</h2>
                                    <p className="text-lg text-gray-600">
                                        {formData.designation && formData.company
                                            ? `${formData.designation} at ${formData.company}`
                                            : 'Designation & Company'}
                                    </p>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        {formData.location && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Location:</span> {formData.location}
                                            </div>
                                        )}
                                        {formData.phone && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Phone:</span> {formData.phone}
                                            </div>
                                        )}
                                        {formData.linkedinUrl && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">LinkedIn:</span>
                                                <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    View Profile
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bio */}
                                {formData.bio && (
                                    <div className="border-b pb-6">
                                        <h3 className="text-lg font-semibold mb-3" style={{ color: '#1e3a5f' }}>About</h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{formData.bio}</p>
                                    </div>
                                )}

                                {/* Investment Preferences */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e3a5f' }}>Investment Preferences</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <span className="block text-sm text-gray-500 mb-1">Investment Range</span>
                                            <span className="font-medium">{formData.investmentRange || 'Not specified'}</span>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <span className="block text-sm text-gray-500 mb-1">Min - Max Investment</span>
                                            <span className="font-medium">
                                                ₹{formData.minInvestment?.toLocaleString()} - ₹{formData.maxInvestment?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {formData.preferredDomains?.length > 0 && (
                                        <div className="mt-6">
                                            <span className="block text-sm text-gray-500 mb-3">Preferred Domains</span>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.preferredDomains.map(domain => (
                                                    <span
                                                        key={domain}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                                                    >
                                                        {domain}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Edit Mode (Form)
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="input"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                        Bio
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="input"
                                        placeholder="Tell startups about yourself..."
                                        maxLength={500}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g., Managing Partner"
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    />
                                </div>

                                <hr className="my-6" />

                                <h2 className="text-xl font-semibold mb-4" style={{ color: '#1e3a5f' }}>Investment Preferences</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Investment Range
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g., ₹10L - ₹50L"
                                            value={formData.investmentRange}
                                            onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Min Investment (₹)
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            min="0"
                                            value={formData.minInvestment}
                                            onChange={(e) => setFormData({ ...formData, minInvestment: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                            Max Investment (₹)
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            min="0"
                                            value={formData.maxInvestment}
                                            onChange={(e) => setFormData({ ...formData, maxInvestment: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1e3a5f' }}>
                                        Preferred Domains
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {domainOptions.map(domain => (
                                            <button
                                                key={domain}
                                                type="button"
                                                onClick={() => toggleDomain(domain)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.preferredDomains.includes(domain)
                                                    ? 'shadow-md'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                style={formData.preferredDomains.includes(domain) ? { backgroundColor: '#ffc107', color: '#1e3a5f' } : { color: '#1e3a5f' }}
                                            >
                                                {domain}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary px-8 flex-1"
                                    >
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchInvestor(); // Reset changes
                                        }}
                                        className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 px-8"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InvestorProfile;

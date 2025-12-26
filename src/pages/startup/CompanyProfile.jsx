import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { startupAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import FileUpload from '../../components/common/FileUpload';

const CompanyProfile = () => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [formData, setFormData] = useState({
        founderName: '',
        startupName: '',
        foundedYear: new Date().getFullYear(),
        description: '',
        domain: '',
        internsRequired: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStartup();
    }, [user]);

    const fetchStartup = async () => {
        try {
            if (user?.roleDocumentId) {
                const response = await startupAPI.getById(user.roleDocumentId);
                const userStartup = response.data;

                if (userStartup) {
                    setStartup(userStartup);
                    setFormData({
                        founderName: userStartup.founderName || '',
                        startupName: userStartup.startupName || '',
                        foundedYear: userStartup.foundedYear || new Date().getFullYear(),
                        description: userStartup.description || '',
                        domain: userStartup.domain || '',
                        internsRequired: userStartup.internsRequired || false,
                        documents: userStartup.documents || []
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching startup:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...formData, userId: user.id || user._id };

            if (startup) {
                await startupAPI.update(startup._id, formData);
                toast.success('Profile updated successfully!');
            } else {
                await startupAPI.create(payload);
                toast.success('Profile created successfully!');
            }
            fetchStartup();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Company Profile</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Founder Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        value={formData.founderName}
                                        onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Startup Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        value={formData.startupName}
                                        onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Domain *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="e.g., fintech, healthcare"
                                        value={formData.domain}
                                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Founded Year
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={formData.foundedYear}
                                        onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows="4"
                                    className="input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell investors about your startup..."
                                />
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                                <FileUpload
                                    label="Upload Pitch Deck or Company Profile"
                                    onUploadSuccess={(path) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            documents: [...(prev.documents || []), path]
                                        }));
                                    }}
                                />

                                {/* List uploaded documents */}
                                {formData.documents && formData.documents.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {formData.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://startova-backend.onrender.com'}${doc}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary-600 hover:underline truncate"
                                                >
                                                    Document {index + 1}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newDocs = [...formData.documents];
                                                        newDocs.splice(index, 1);
                                                        setFormData(prev => ({ ...prev, documents: newDocs }));
                                                    }}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="interns"
                                    className="w-4 h-4 text-primary-600 rounded"
                                    checked={formData.internsRequired}
                                    onChange={(e) => setFormData({ ...formData, internsRequired: e.target.checked })}
                                />
                                <label htmlFor="interns" className="ml-2 text-sm text-gray-700">
                                    Looking for interns
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full md:w-auto px-8"
                            >
                                {loading ? 'Saving...' : startup ? 'Update Profile' : 'Create Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CompanyProfile;

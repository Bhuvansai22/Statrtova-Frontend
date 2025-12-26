import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import FileUpload from '../../components/common/FileUpload';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';


const FinancialDocuments = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Fetch documents on load
    useEffect(() => {
        console.log('Current User Context:', user); // Debug log
        if (user?.roleDocumentId) {
            fetchDocuments();
        } else {
            console.log('roleDocumentId missing in user object');
        }
    }, [user]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/startups/${user.roleDocumentId}`);
            setDocuments(data.financialDocuments || []);
        } catch (err) {
            console.error('Failed to fetch documents', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = async (fileData) => {
        if (!user || !user.roleDocumentId) {
            setError('User session invalid. Please Logout and Login again.');
            return;
        }

        try {
            setUploading(true);
            setError('');

            // 1. Upload file to server
            // File is already uploaded by FileUpload component

            // 2. Save metadata to startup profile
            const { filePath, fileName } = fileData;
            const docType = 'other';

            const { data: newDocs } = await api.post(`/startups/${user.roleDocumentId}/documents`, {
                name: fileName,
                type: docType,
                url: filePath
            });

            setDocuments(newDocs);
        } catch (err) {
            console.error('Save metadata failed:', err);
            console.log('Error details:', err.response?.data);
            const errorMessage = err.response?.data?.error || 'Failed to save document info.';
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Are you sure you want to remove this document?')) return;
        try {
            const { data: newDocs } = await api.delete(`/startups/${user.roleDocumentId}/documents/${docId}`);
            setDocuments(newDocs);
        } catch (err) {
            console.error(err);
            setError('Failed to delete document');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Documents</h1>
                        <p className="text-gray-600 mb-8">Upload cashflow statements, balance sheets, and income statements</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
                            <FileUpload
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : documents.length === 0 ? (
                                <p className="text-gray-500 italic">No documents uploaded yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {documents.map((doc) => (
                                        <li key={doc._id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-blue-50 rounded text-blue-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                                    <p className="text-sm text-gray-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <a
                                                    href={`https://startova-backend.onrender.com${doc.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FinancialDocuments;

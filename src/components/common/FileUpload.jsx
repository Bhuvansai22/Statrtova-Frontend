import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ onUploadSuccess, label = "Upload Document" }) => {
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (Client side)
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload PDF, Word, or Image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error('File size too large. Max 5MB.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        let response;
        try {
            // Content-Type header must be undefined to let browser set boundary
            response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFileName(file.name);
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            console.log('Error response:', error.response); // Debug log
            toast.error(error.response?.data?.error || 'Upload failed');
            e.target.value = null; // Reset input
            return; // Exit on error
        } finally {
            setUploading(false);
        }

        // Execute callback outside the upload try/catch to avoid showing "Upload failed" if callback fails
        if (response?.data && onUploadSuccess) {
            try {
                await onUploadSuccess(response.data);
            } catch (cbError) {
                console.error("Callback error", cbError);
                // Parent handles its own errors
            }
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {!fileName ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-500 transition-colors">
                    <div className="space-y-1 text-center">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-2"></div>
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                        <span>Upload a file</span>
                                        <input
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, DOC, PNG, JPG up to 5MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-1 flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center">
                        <DocumentIcon className="h-6 w-6 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 truncate max-w-xs">{fileName}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFileName('')}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;

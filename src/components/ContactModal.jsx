import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { messageAPI } from '../utils/api';

const ContactModal = ({ isOpen, onClose, startupId, startupName, investorId }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await messageAPI.send({
                investorId,
                startupId,
                senderRole: 'investor',
                subject,
                message
            });
            toast.success('Message sent successfully!');
            onClose();
            setSubject('');
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6"
                                        style={{ color: '#1e3a5f' }}
                                    >
                                        Contact {startupName}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#1e3a5f' }}>
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            placeholder="e.g., Interested in investing"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#1e3a5f' }}>
                                            Message
                                        </label>
                                        <textarea
                                            className="input min-h-[120px]"
                                            required
                                            placeholder="Hi, I saw your pitch and..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary flex items-center space-x-2"
                                        >
                                            {loading ? (
                                                <span>Sending...</span>
                                            ) : (
                                                <>
                                                    <PaperAirplaneIcon className="h-4 w-4" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ContactModal;

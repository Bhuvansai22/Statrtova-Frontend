import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { startupAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

const FuturePlans = () => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [futurePlans, setFuturePlans] = useState('');
    const [pitchIdeas, setPitchIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStartup();
    }, []);

    const fetchStartup = async () => {
        try {
            const startupId = user.roleDocumentId || user.id;
            const response = await startupAPI.getById(startupId);
            const userStartup = response.data;
            if (userStartup) {
                setStartup(userStartup);
                setFuturePlans(userStartup.futurePlans || '');
                setPitchIdeas(userStartup.pitchIdeas || []);
            }
        } catch (error) {
            console.error('Error fetching startup:', error);
        }
    };

    const handleSavePlans = async () => {
        if (!startup) return toast.error('Please create your profile first');

        setLoading(true);
        try {
            await startupAPI.update(startup._id, { futurePlans });
            toast.success('Future plans updated!');
        } catch (error) {
            toast.error('Failed to update plans');
        } finally {
            setLoading(false);
        }
    };

    const handleAddIdea = async () => {
        if (!newIdea.title || !newIdea.description) {
            return toast.error('Please fill in both title and description');
        }

        const updatedIdeas = [...pitchIdeas, { ...newIdea, createdAt: new Date() }];

        try {
            await startupAPI.update(startup._id, { pitchIdeas: updatedIdeas });
            setPitchIdeas(updatedIdeas);
            setNewIdea({ title: '', description: '' });
            toast.success('Pitch idea added!');
        } catch (error) {
            toast.error('Failed to add idea');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Future Plans */}
                    <div className="card">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Future Plans</h1>
                        <textarea
                            rows="6"
                            className="input"
                            placeholder="Describe your company's vision and roadmap..."
                            value={futurePlans}
                            onChange={(e) => setFuturePlans(e.target.value)}
                        />
                        <button
                            onClick={handleSavePlans}
                            disabled={loading}
                            className="btn btn-primary mt-4"
                        >
                            {loading ? 'Saving...' : 'Save Plans'}
                        </button>
                    </div>

                    {/* Pitch Ideas */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pitch Ideas</h2>

                        <div className="space-y-4 mb-6">
                            <input
                                type="text"
                                className="input"
                                placeholder="Idea title..."
                                value={newIdea.title}
                                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                            />
                            <textarea
                                rows="3"
                                className="input"
                                placeholder="Describe your pitch idea..."
                                value={newIdea.description}
                                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                            />
                            <button onClick={handleAddIdea} className="btn btn-primary">
                                Add Idea
                            </button>
                        </div>

                        <div className="space-y-3">
                            {pitchIdeas.map((idea, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{idea.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FuturePlans;

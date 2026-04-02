import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && user) {
            const url = user.userConfiguration?.landingPage || '/home';
            navigate(url);
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
            {/* Nav */}
            <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        HomeSync
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        Get started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto w-full">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Household management, simplified
                </div>

                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Manage your home,{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        together
                    </span>
                </h1>

                <p className="text-lg text-gray-500 max-w-2xl mb-10 leading-relaxed">
                    HomeSync lets you organize your household with ease. Create houses, invite members,
                    assign tasks, and stay in sync — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-md text-base"
                    >
                        Create an account
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-colors text-base"
                    >
                        Sign in
                    </button>
                </div>
            </main>

            {/* Features */}
            <section className="max-w-7xl mx-auto w-full px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    {
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        ),
                        title: 'Multiple Houses',
                        description: 'Create or join several households and switch between them effortlessly.',
                    },
                    {
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        ),
                        title: 'Task Management',
                        description: 'Assign, track and complete household tasks so nothing falls through the cracks.',
                    },
                    {
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                        ),
                        title: 'Invite Members',
                        description: 'Share an invite code with your household members to get everyone on board instantly.',
                    },
                ].map(({ icon, title, description }) => (
                    <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {icon}
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default LandingPage;
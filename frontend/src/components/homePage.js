import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const goToImageBlur = () => {
        navigate('/image-blur');
    };

    return (
        <div className='container overflow-x-hidden'>
            <div className='w-screen sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-20'>
                <div className="md:text-left text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6">Welcome to the FaceBlur</h1>
                    <h3 className="text-lg sm:text-2xl mb-6">Blur faces with the help of AI 🤖 (not Al 🙋‍♂️)</h3>
                    <button
                        onClick={goToImageBlur}
                        className="bg-amber-500 text-white w-72 sm:w-auto font-bold px-6 py-3 rounded hover:bg-amber-600"
                    >
                        Get Started
                    </button>
                </div>
            </div>

            <div className='bg-white w-screen sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-30'>
                <div className="md:text-left text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Protect Privacy</h1>
                    <p className='text-lg'>Prevent posting identities online.</p>
                </div>
            </div>
            <div className='bg-gray-100 py-10 sm:py-20 w-screen'>
                <div className='container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40'>
                    <div className='text-center'>
                        <h2 className='text-3xl font-bold mb-6'>Why Protect Privacy Online?</h2>
                        <p className='text-lg leading-relaxed'>
                            Posting photos online without blurring faces can compromise people's privacy
                            and safety. Protecting identities helps prevent misuse of personal information
                            and maintains trust in online communities.
                        </p>
                    </div>
                </div>
            </div>
        </div>



    );
}

export default HomePage;

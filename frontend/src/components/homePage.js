import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const goToImageBlur = () => {
        navigate('/image-blur');
    };

    return (
        <div className='container'>
            <div className='w-screen sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-20'>
                <div className="md:text-left text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6">Welcome to the FaceBlur</h1>
                    <h3 className="text-lg sm:text-2xl mb-6">Blur faces with the help of AI 🤖</h3>
                    <button
                        onClick={goToImageBlur}
                        className="bg-amber-500 text-white w-72 sm:w-auto font-bold px-6 py-3 rounded hover:bg-amber-600"
                    >
                        Get Started
                    </button>
                </div>
            </div>

            <div className='bg-white w-screen sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-20 justify-between flex flex-col md:flex-row items-center'>
                <div className="text-center md:mb-0 mb-5">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Protect Privacy</h1>
                    <p className='text-lg'>Prevent identity exposure online by blurring faces.</p>
                </div>
                <div className='sm:ml-8 sm:max-w-lg xl:max-w-3xl'>
                    <img src='blurred_crowd.jpg' className='m-auto rounded-lg' alt='Blurred Crowd' loading="lazy" />
                </div>
            </div>
            <div className='bg-gradient-to-r from-orange-600 to-amber-500 py-10 text-white sm:py-20 w-screen'>
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

import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const goToImageBlur = () => {
        navigate('/image-blur');
    };

    return (
        <div className='container'>
            <div className='w-screen px-56 py-40'>
                <div className="text-left">
                    <h1 className="text-6xl font-bold mb-10">Welcome to the FaceBlur</h1>
                    <h3 className="text-2xl mb-10">Blur faces with the help of AI 🤖 (not Al 🙋‍♂️)</h3>
                    <button
                        onClick={goToImageBlur}
                        className="bg-amber-500 text-white w-72 font-bold px-6 py-3 rounded hover:bg-amber-600"
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <div className='bg-white w-screen px-40 py-20 mb-10'>
                <div className="text-left">
                    <h1 className="text-4xl font-bold mb-4">Protect Privacy</h1>
                    <h1 className='text-xl'>Prevent posting identities online.</h1>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

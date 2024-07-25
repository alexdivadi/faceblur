import React from "react";

function AboutPage() {
    return <div className="w-screen py-10 px-3 md:px-10">
        <div className="bg-white py-20 px-4 sm:px-8 md:px-16 lg:px-20 text-justify rounded-xl">
            <h1 className="text-3xl md:text-left text-center sm:text-4xl font-bold text-gray-800 mb-12">About Us</h1>
            <div className="flex flex-col justify-center">
                <p className="text-xl leading-relaxed mb-20">
                    As the field of AI advances, facial recognition and detection technology becomes
                    more and more sophisticated. FaceBlur is powered by such state-of-the-art AI
                    algorithms. All it takes now is a single image of your face on the internet for a
                    model to be able to accurately identify your likeness. FaceBlur hopes to use this
                    advanced technology for good by preventing more unwanted faces to be exposed online.
                </p>
            </div>
            <h1 className="text-3xl md:text-left text-center sm:text-4xl font-bold text-gray-800 mb-12">Contribute</h1>
            <div className="flex flex-col justify-center">
                <p className="text-xl leading-relaxed">
                    If this project interests you, please checkout <span className="text-blue-500 underline hover:text-blue-600">
                        <a href="https://github.com/alexdivadi/faceblur">the GitHub
                        </a></span> for this project, or
                    contact me directly.
                </p>
            </div>
        </div>
    </div>
}

export default AboutPage;
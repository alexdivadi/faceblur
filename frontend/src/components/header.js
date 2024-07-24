import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <header className="text-gray-800 px-20 py-4">
            <div className="container mx-auto flex justify-between items-center py-5">
                <div className="text-3xl font-bold text-gray-900">FaceBlur</div>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <NavLink to="/" exact='true' className="text-lg text-gray-900 hover:text-amber-600">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/image-blur" className="text-lg text-gray-900 hover:text-amber-600">
                                Blur
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className="text-lg text-gray-900 hover:text-amber-600">
                                About
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
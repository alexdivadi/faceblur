import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ options, defaultOption, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false); // Close the dropdown after selecting an option
        onSelect(option); // Call onSelect callback with the selected option
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown button */}
            <button
                className={`${className}`}
                onClick={toggleDropdown}
            >
                {selectedOption}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10">
                    {/* Menu items */}
                    {options.map((option) => (
                        <button
                            key={option}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

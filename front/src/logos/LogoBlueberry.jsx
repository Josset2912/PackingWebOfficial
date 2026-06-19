import blueberryLogo from '../assets/blueberries.svg';
import React from 'react';
const LogoBlueberry = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    return (
        <img
            src={blueberryLogo}
            alt="Blueberry Logo"
            className={`${sizeClasses[size] || sizeClasses.md} ${className}`}
        />
    );
}

export default LogoBlueberry;
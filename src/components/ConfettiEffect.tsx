'use client'
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect: React.FC = () => {
    // Track viewport to match full-screen without affecting layout
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [height, setHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Confetti
            width={width}
            height={height}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
            numberOfPieces={220}
            recycle={false}
            gravity={0.3}
        />
    );
};

export default ConfettiEffect;
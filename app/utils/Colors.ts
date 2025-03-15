"use client"
import React from 'react'

interface ColorsProps {
    newcolor: string;
}

const Colors: React.FC<ColorsProps> = ({ newcolor }) => {
    const ColorArray = [
        '#E63946', // Red
        '#F4A261', // Orange
        '#2A9D8F', // Teal
        '#264653', // Deep Navy
        '#A8DADC', // Aqua
        '#457B9D', // Blue
        '#1D3557', // Dark Blue
        '#F4D35E', // Yellow
        '#EE6C4D', // Coral
        '#3D405B', // Greyish Blue
        '#C56C86', // Rose Pink
        '#6A0572'  // Purple
    ];


    const sessColor = JSON.parse(sessionStorage.getItem('couu-olorsx-wertqo-234jhiexo') || '');


    if (!sessColor) {
        sessionStorage.setItem('couu-olorsx-wertqo-234jhiexo', JSON.stringify(ColorArray));
        return ColorArray;
    }

    else if (sessColor.includes(newcolor)) {
        return sessColor;
    }

    else {
        const newArray = [...sessColor];
        newArray.unshift(newcolor);
        if (newArray.length > 12) {
            newArray.pop();
        }
        sessionStorage.setItem('couu-olorsx-wertqo-234jhiexo', JSON.stringify(newArray));
        return newArray;

    }



}

export default Colors
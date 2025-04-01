"use client";

import { useEffect, useState } from "react";

type ColorsProps = string;

const Colors = (newcolor: ColorsProps) => {
    const ColorArray = [
        '#E63946', '#F4A261', '#2A9D8F', '#264653',
        '#A8DADC', '#457B9D', '#1D3557', '#F4D35E',
        '#EE6C4D', '#3D405B', '#C56C86', '#6A0572'
    ];

    const [colors, setColors] = useState<string[]>(ColorArray);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedColors = sessionStorage.getItem('couu-olorsx-wertqo-234jhiexo');
            const sessColor = storedColors ? JSON.parse(storedColors) : [];

            if (!Array.isArray(sessColor) || sessColor.length === 0) {
                sessionStorage.setItem('couu-olorsx-wertqo-234jhiexo', JSON.stringify(ColorArray));
                setColors(ColorArray);
            } else if (!sessColor.includes(newcolor)) {
                const newArray = [newcolor, ...sessColor].slice(0, 12);
                sessionStorage.setItem('couu-olorsx-wertqo-234jhiexo', JSON.stringify(newArray));
                setColors(newArray);
            } else {
                setColors(sessColor);
            }
        }
    }, [newcolor]);

    return colors;
};

export default Colors;

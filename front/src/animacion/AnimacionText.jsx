import { useRef, useEffect, useState } from "react";

const HoverScrollText = ({ text }) => {
    const textRef = useRef(null);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!textRef.current) return;

        const containerWidth = textRef.current.parentElement.offsetWidth;
        const textWidth = textRef.current.scrollWidth;

        const diff = textWidth - containerWidth;

        // 🔴 si el texto apenas sobrepasa, no animar
        if (diff <= 15) {
            setDistance(0);
            setDuration(0);
            return;
        }

        const speed = 30; // px/seg
        const minDuration = 2; // ⏱ mínimo (clave para suavidad)

        const calculatedDuration = diff / speed;

        setDistance(diff);
        setDuration(
            calculatedDuration < minDuration ? minDuration : calculatedDuration
        );
    }, [text]);

    return (
        <div className="relative w-full overflow-hidden group">
            <div
                ref={textRef}
                className={`inline-flex w-max whitespace-nowrap ${distance ? "hover-scroll-loop" : ""
                    }`}
                style={
                    distance
                        ? {
                            "--move": `-${distance}px`,
                            "--duration": `${duration}s`,
                        }
                        : {}
                }
            >
                {text}
            </div>
        </div>
    );
};

export default HoverScrollText;

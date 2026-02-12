"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export const CanvasRevealEffect = ({
    animationSpeed = 5,
    containerClassName,
    colors,
    dotSize,
}: {
    animationSpeed?: number;
    containerClassName?: string;
    colors?: number[][];
    dotSize?: number;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    const primaryColor = colors?.[0] || [99, 102, 241]; // indigo
    const secondaryColor = colors?.[1] || colors?.[0] || [139, 92, 246]; // purple
    const size = dotSize || 3;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
                canvas.width = width;
                canvas.height = height;
            }
        });

        resizeObserver.observe(parent);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        startTimeRef.current = performance.now();

        const cols = Math.ceil(dimensions.width / (size * 3));
        const rows = Math.ceil(dimensions.height / (size * 3));

        const animate = (timestamp: number) => {
            const elapsed = (timestamp - startTimeRef.current) / 1000;
            const progress = Math.min(elapsed * (animationSpeed / 5), 1);

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * size * 3 + size;
                    const y = j * size * 3 + size;

                    // Distance from center for wave effect
                    const cx = dimensions.width / 2;
                    const cy = dimensions.height / 2;
                    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                    const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
                    const normalizedDist = dist / maxDist;

                    // Wave-based reveal from center outward
                    const threshold = progress * 1.5 - normalizedDist * 0.8;
                    if (threshold <= 0) continue;

                    const opacity = Math.min(threshold * 2, 1);
                    const t = (Math.sin(i * 0.5 + j * 0.3 + elapsed * 2) + 1) / 2;

                    const r = Math.round(
                        primaryColor[0] * (1 - t) + secondaryColor[0] * t
                    );
                    const g = Math.round(
                        primaryColor[1] * (1 - t) + secondaryColor[1] * t
                    );
                    const b = Math.round(
                        primaryColor[2] * (1 - t) + secondaryColor[2] * t
                    );

                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Once fully revealed, keep drawing with subtle animation
                const animateIdle = (ts: number) => {
                    const t2 = (ts - startTimeRef.current) / 1000;
                    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

                    for (let i = 0; i < cols; i++) {
                        for (let j = 0; j < rows; j++) {
                            const x = i * size * 3 + size;
                            const y = j * size * 3 + size;

                            const t = (Math.sin(i * 0.5 + j * 0.3 + t2 * 1.5) + 1) / 2;
                            const r = Math.round(
                                primaryColor[0] * (1 - t) + secondaryColor[0] * t
                            );
                            const g = Math.round(
                                primaryColor[1] * (1 - t) + secondaryColor[1] * t
                            );
                            const b = Math.round(
                                primaryColor[2] * (1 - t) + secondaryColor[2] * t
                            );

                            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
                            ctx.beginPath();
                            ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }

                    animationRef.current = requestAnimationFrame(animateIdle);
                };
                animationRef.current = requestAnimationFrame(animateIdle);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions, animationSpeed, size, primaryColor, secondaryColor]);

    return (
        <div className={cn("h-full relative w-full", containerClassName)}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

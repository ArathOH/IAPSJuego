import React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Formulario: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        interface Star {
            x: number;
            y: number;
            radius: number;
            dx: number;
            dy: number;
        }

        const stars: Star[] = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
        }));

        const drawStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ffffff";
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            stars.forEach((star) => {
                star.x += star.dx;
                star.y += star.dy;

                if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
            });

            animationFrameId = requestAnimationFrame(drawStars);
        };

        drawStars();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const SendForm = () => {
        navigate("/Juego");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full animate-in fade-in slide-in-from-top duration-500 z-10">
                <h1 className="text-3xl font-extrabold text-purple-600 text-center mb-6">
                    Formulario de Registro
                </h1>
                <form className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Apellidos</label>
                        <input
                            type="text"
                            placeholder="Ingresa tus apellidos"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Edad</label>
                        <input
                            type="number"
                            placeholder="Ingresa tu edad"
                            max={100}
                            min={10}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={SendForm}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-transform duration-300 hover:scale-105"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;

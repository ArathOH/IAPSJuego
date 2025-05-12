import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);

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

  const handleStart = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate("/respiracion");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-5xl font-extrabold mb-8 drop-shadow-lg animate-fade-in-down">
          ¡Bienvenido!
        </h1>
        {countdown === null ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xl transition transform hover:scale-105 animate-bounce"
            onClick={handleStart}
          >
            Iniciar
          </button>
        ) : (
          <div className="text-white text-6xl font-black animate-pulse transition duration-700 ease-in-out">
            Inicia en {countdown}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const fases = [
  { nombre: "Inhala", duracion: 4000 },
  { nombre: "Mantén", duracion: 3000 },
  { nombre: "Exhala", duracion: 4000 },
];

const TOTAL_CICLOS = 5; // 10 ciclos ≈ 3-5 minutos

const Respiracion = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [faseIndex, setFaseIndex] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const navigate = useNavigate();

  const faseActual = fases[faseIndex];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const siguienteFase = (faseIndex + 1) % fases.length;

      if (siguienteFase === 0) {
        setCiclo((prev) => {
          const nuevoCiclo = prev + 1;
          if (nuevoCiclo >= TOTAL_CICLOS) {
            navigate("/formulario");
          }
          return nuevoCiclo;
        });
      }

      setFaseIndex(siguienteFase);
    }, faseActual.duracion);

    return () => clearTimeout(timer);
  }, [faseIndex, ciclo, faseActual.duracion, navigate]);

  // Animación de escala para el círculo
  const getScale = () => {
    switch (faseActual.nombre) {
      case "Inhala":
        return "scale-125";
      case "Mantén":
        return "scale-125";
      case "Exhala":
        return "scale-75";
      default:
        return "scale-100";
    }
  };

  const handleSkip = () => {
    navigate("/formulario");
  };

  return (
    <>
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div
          className={`w-60 h-60 rounded-full bg-green-400 opacity-80 transition-transform duration-[${faseActual.duracion}ms] ease-in-out ${getScale()}`}
          ></div>
        <h1 className="mt-8 text-4xl text-white font-bold animate-pulse">
          {faseActual.nombre}
        </h1>
        <p className="text-white mt-2 text-lg">Ciclo {ciclo + 1} de {TOTAL_CICLOS}</p>
        <button className="bg-green-400 rounded-2xl w-full h-10 cursor-pointer" onClick={handleSkip}> Saltar </button>
      </div>
    </div>
          </>
  );
};

export default Respiracion;

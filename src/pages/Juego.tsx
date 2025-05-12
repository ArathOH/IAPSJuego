import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriaPorEmocion, getRandomIaps } from '../utils/iapsLoader';

interface Nivel {
  titulo: string;
  emocion: 'negativa' | 'positiva' | 'neutral';
  descripcion: string;
}

const niveles: Nivel[] = [
  {
    titulo: 'Nivel 1: Desafío de la Serenidad',
    emocion: 'neutral',
    descripcion:
      'Observa la imagen y trata de mantenerte neutral. ¿Lo lograste?',
  },
  {
    titulo: 'Nivel 2: El Desafío del Estrés',
    emocion: 'negativa',
    descripcion:
      'Si la imagen es desagradable, imagina lo contrario. ¿Lograste transformarla?',
  },
  {
    titulo: 'Nivel 3: El Desafío de la Felicidad',
    emocion: 'positiva',
    descripcion:
      'Recuerda un momento agradable relacionado. ¿Pudiste hacerlo?',
  },
  /* … añade los otros niveles si los necesitas … */
];

const Juego: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  const [nivelActual, setNivelActual] = useState(0);
  const [mostrarFinal, setMostrarFinal] = useState(false);
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  /* ---------- Fondo animado (sin cambios) ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Star {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
    }
    const stars: Star[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
      });

      frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);
  /* ------------------------------------------------- */

  /* ---------- Carga de imagen al cambiar de nivel ---------- */
  useEffect(() => {
    const { emocion } = niveles[nivelActual];
    const categoria = categoriaPorEmocion(emocion);
    const nuevaImagen = getRandomIaps(categoria);
    setImagenActual(nuevaImagen);
  }, [nivelActual]);
  /* --------------------------------------------------------- */

  const handleRespuesta = (acertado: boolean) => {
    if (!acertado) {
      navigate('/'); // vuelve a inicio
      return;
    }
    if (nivelActual < niveles.length - 1) {
      setNivelActual((n) => n + 1);
    } else {
      setMostrarFinal(true);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center text-white px-4">
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-lg w-full text-center animate-in fade-in slide-in-from-bottom duration-500">
        {!mostrarFinal ? (
          <>
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              {niveles[nivelActual].titulo}
            </h2>

            {imagenActual ? (
              <img
                src={imagenActual}
                alt="Imagen IAPS"
                className="rounded-xl mx-auto mb-4 shadow-lg max-h-[45vh]"
              />
            ) : (
              <p className="text-white">Cargando imagen…</p>
            )}

            <p className="text-lg text-white mb-6">
              {niveles[nivelActual].descripcion}
            </p>

            <p className="mb-4 font-semibold text-white">¿Logrado?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRespuesta(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl transition-transform hover:scale-105"
              >
                Sí
              </button>
              <button
                onClick={() => handleRespuesta(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl transition-transform hover:scale-105"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <div className="text-white">
            <h2 className="text-3xl font-extrabold text-purple-400 mb-6">
              ¡Has completado el juego!
            </h2>
            <div className="space-y-4 text-left">
              <p>🤔 ¿Qué utilidad tiene que imagines el peor escenario?</p>
              <input
                className="w-full border rounded-md p-2"
                type="text"
                placeholder="Escribe tu respuesta aquí…"
              />
              <p>🔍 ¿Qué utilidad tiene imaginar esos escenarios cuando no hay evidencia?</p>
              <input
                className="w-full border rounded-md p-2"
                type="text"
                placeholder="Escribe tu respuesta aquí…"
              />
              <p>📉 ¿Qué tan probable es que suceda lo que imaginas?</p>
              <input
                className="w-full border rounded-md p-2"
                type="text"
                placeholder="Escribe tu respuesta aquí…"
              />
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 px-6 rounded-xl transition-transform hover:scale-105"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Juego;

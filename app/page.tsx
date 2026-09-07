"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Image as ImageIcon, Layers, Download, Moon, Sun } from "lucide-react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cartoon");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const styles = [
    { id: "cartoon", label: "Cartoon" },
    { id: "anime", label: "Anime" },
    { id: "pixel", label: "Pixel Art" },
    { id: "3d", label: "3D" },
    { id: "meme", label: "Meme" },
    { id: "realistic", label: "Realista" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar figurinha. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            <span className="font-bold text-lg">Sticker AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/editor"
              className="text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Editor
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Crie figurinhas incríveis com IA
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Text-to-sticker • Image-to-sticker • Editor avançado • GIF animado
          </p>
        </section>

        {/* Generator Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 mb-8">
          <label className="block text-sm font-medium mb-2">Descreva sua figurinha</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: um gato fofo com óculos de sol, estilo cartoon, fundo transparente..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-base"
          />

          {/* Styles */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Estilo</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    style === s.id
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="mt-5 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
          >
            {isGenerating ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Figurinha
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {generatedImage && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-5 mb-8 text-center">
            <h2 className="font-semibold mb-4">Sua figurinha</h2>
            <div className="inline-block bg-[url('/checkerboard.png')] bg-repeat p-4 rounded-xl">
              <img
                src={generatedImage}
                alt="Figurinha gerada"
                className="max-w-full max-h-80 rounded-lg"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <a
                href={generatedImage}
                download="figurinha.png"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium transition"
              >
                <Download className="w-4 h-4" />
                Baixar PNG
              </a>
              <Link
                href={`/editor?image=${encodeURIComponent(generatedImage)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition"
              >
                <Layers className="w-4 h-4" />
                Editar
              </Link>
            </div>
          </div>
        )}

        {/* Features */}
        <section className="grid sm:grid-cols-3 gap-4 mt-10">
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="w-8 h-8 text-violet-500 mb-3" />
            <h3 className="font-semibold mb-1">Geração com IA</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Text-to-sticker e image-to-sticker com vários estilos.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Layers className="w-8 h-8 text-violet-500 mb-3" />
            <h3 className="font-semibold mb-1">Editor Avançado</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Canvas com camadas, texto, filtros e transformações.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ImageIcon className="w-8 h-8 text-violet-500 mb-3" />
            <h3 className="font-semibold mb-1">GIF & Export</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Suporte a GIF animado, PNG transparente, WebP e SVG.
            </p>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-sm text-zinc-500">
        Sticker AI • Feito para criar figurinhas incríveis
      </footer>
    </div>
  );
}

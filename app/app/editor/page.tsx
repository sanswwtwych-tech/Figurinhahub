"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Type,
  Trash2,
  Layers,
} from "lucide-react";

let fabric: any = null;

function EditorContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    import("fabric").then((mod: any) => {
      fabric = mod.Canvas ? mod : mod.fabric || mod.default || mod;
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady || !canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 512,
      height: 512,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    const imageUrl = searchParams.get("image");
    if (imageUrl) {
      fabric.Image.fromURL(
        imageUrl,
        (img: any) => {
          img.scaleToWidth(400);
          img.set({
            left: 56,
            top: 56,
          });
          canvas.add(img);
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const size = Math.min(container.clientWidth - 32, 512);
      canvas.setDimensions({ width: size, height: size });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [isReady, searchParams]);

  const addText = () => {
    if (!fabricRef.current || !textInput.trim()) return;
    const text = new fabric.IText(textInput, {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 32,
      fill: "#000000",
      fontWeight: "bold",
    });
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.renderAll();
    setTextInput("");
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
    }
  };

  const exportPNG = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = "figurinha-editada.png";
    link.href = dataURL;
    link.click();
  };

  const bringForward = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.bringObjectForward(active);
      canvas.renderAll();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 h-14 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-violet-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <span className="font-semibold text-sm sm:text-base">Editor de Figurinha</span>
          <button
            onClick={exportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 py-4">
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Digite um texto..."
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              onKeyDown={(e) => e.key === "Enter" && addText()}
            />
            <button
              onClick={addText}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Adicionar texto"
            >
              <Type className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={bringForward}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Trazer para frente"
            >
              <Layers className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
              title="Excluir selecionado"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="canvas-container bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] dark:bg-[linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)] p-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-4">
          Toque nos objetos para selecionar • Arraste para mover • Use os handles para redimensionar e girar
        </p>
      </main>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}

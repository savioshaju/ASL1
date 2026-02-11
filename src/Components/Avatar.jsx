import React, { useEffect, useRef, useState } from "react";
import { initAvatar } from "../three/avatarEngine";

export default function Avatar() {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [cameraSide, setCameraSide] = useState("Right");

  useEffect(() => {
    if (!mountRef.current) return;

    apiRef.current = initAvatar(mountRef.current, () => {
      setLoaded(true);

      // Auto focus ASL view (hands + chest)
      setTimeout(() => {
        apiRef.current?.focusASL?.();
      }, 200);
    });

    return () => {
      apiRef.current?.dispose?.();
    };
  }, []);

  // Create array of supported characters
  const chars = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    ..."0123456789".split("")
  ];

  const handleSign = (char) => {
    if (apiRef.current) {
      apiRef.current.playSign(char);
    }
  };

  const handleToggleCamera = () => {
    if (apiRef.current && apiRef.current.toggleCameraPosition) {
      const newSide = apiRef.current.toggleCameraPosition();
      setCameraSide(newSide === "RIGHT" ? "Right" : "Left");
    }
  };
  const inputRef = useRef(null);
  const isPlayingRef = useRef(false);

  const playText = async (text) => {
    if (!apiRef.current || isPlayingRef.current) return;
    isPlayingRef.current = true;

    const words = text.toLowerCase().trim().split(/\s+/);

    let i = 0;

    while (i < words.length) {

      let matched = false;

      for (let len = 3; len > 0; len--) {
        if (i + len > words.length) continue;

        const phrase = words.slice(i, i + len).join(" ");

        if (apiRef.current.playWord?.(phrase)) {
          await new Promise((r) => setTimeout(r, 1300));
          i += len;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const word = words[i];

        for (const ch of word) {
          apiRef.current.playSign(ch);
          await new Promise((r) => setTimeout(r, 900));
        }

        i++;
      }
    }

    isPlayingRef.current = false;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden relative">

      {/* 3D Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full absolute inset-0 z-0"
      />

      {/* Loading Overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 backdrop-blur-sm">
          <div className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading Avatar...
          </div>
        </div>
      )}

      <div className="absolute bottom-6 mx-auto z-10 w-[95%] md:w-[90%] max-w-4xl p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl flex flex-col gap-4 transition-all hover:bg-white/40">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-gray-800 font-bold text-lg tracking-tight">ASL Dictionary</h2>
          <div className="flex gap-2">
            <button
              onClick={handleToggleCamera}
              className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-full transition-colors shadow-sm"
              title="Toggle Camera Position"
            >
              {cameraSide} View
            </button>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter text to sign"
            className="px-4 py-2 rounded-lg border border-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => playText(inputRef.current.value)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Sign
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-h-[35vh] overflow-y-auto custom-scrollbar p-1">
          {chars.map((char) => (
            <button
              key={char}
              onClick={() => handleSign(char)}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-white/60 hover:bg-[#4f46e5] hover:text-white text-gray-700 font-bold shadow-sm transition-all duration-200 flex items-center justify-center border border-white/50 active:scale-95 text-lg"
              title={`Sign ${char}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function FullscreenLock({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [glitchText, setGlitchText] = useState("BIRBAL SAHNI");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFullscreenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/audio.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.currentTime = 0;
        a.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      isFullscreenRef.current = fs;
      setIsFullscreen(fs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    const fs = !!document.fullscreenElement;
    isFullscreenRef.current = fs;
    setIsFullscreen(fs);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const target = "BIRBAL SAHNI";
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const result = target.split("").map((ch, i) => {
        if (ch === " ") return " ";
        if (frame > i * 3) return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setGlitchText(result);
      if (frame > target.length * 3) {
        setGlitchText(target);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isFullscreen]);

  const syncAudio = useCallback((muted: boolean, fullscreen: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fullscreen && !muted) {
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.muted = muted;
    }
  }, []);

  useEffect(() => {
    syncAudio(isMuted, isFullscreen);
  }, [isFullscreen, isMuted, syncAudio]);

  const requestFullscreenLink = async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).msRequestFullscreen) {
        await (docEl as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  };

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      syncAudio(next, isFullscreenRef.current);
      return next;
    });
  }, [syncAudio]);

  if (!isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050208] text-white p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 max-w-lg w-full border border-purple-500/10 bg-[#0d0a18]/80 backdrop-blur-xl p-8 sm:p-10 rounded-sm flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-400/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-purple-400/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-purple-400/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-400/40" />

          <div className="w-14 h-14 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: "6s" }} />
            <div className="absolute w-8 h-8 border border-accent/20 rounded-full animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
            <div className="w-2 h-2 rounded-full bg-accent/80 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tighter text-white mb-2 font-mono">
            {glitchText}
          </h1>

          <span className="text-[10px] font-mono tracking-[0.3em] text-accent/50 mb-6 uppercase">
            Industrial Manufacturing // Teleoperation Platform
          </span>

          <p className="text-xs text-muted leading-relaxed font-light mb-8 max-w-sm">
            This experience is designed for fullscreen viewing. 
            Immersive audio and interactive 3D visuals will activate automatically 
            for the best experience.
          </p>

          <button
            onClick={requestFullscreenLink}
            className="group relative px-8 py-3 bg-purple-950/40 border border-purple-400/30 text-accent font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-purple-900/30 hover:border-purple-300/50 hover:text-white transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">Enter Experience</span>
          </button>
        </div>

        <div className="absolute bottom-8 text-[9px] font-mono tracking-widest text-accent/25 uppercase">
          AI + ROBOTICS BOOTCAMP // DELHI 2026
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-6 right-6 z-[90] flex items-center gap-4 pointer-events-auto select-none">
        <button
          onClick={toggleMute}
          className="flex items-center gap-3 bg-[#0d0a18]/40 border border-purple-500/10 px-3 py-1.5 rounded-sm hover:border-accent/40 hover:bg-[#1a1528]/40 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-end gap-0.5 h-3 w-4">
            <div
              className={`w-0.5 bg-accent/70 rounded-full transition-all ${
                !isMuted ? "animate-pulse h-full" : "h-1"
              }`}
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className={`w-0.5 bg-accent/70 rounded-full transition-all ${
                !isMuted ? "animate-pulse h-[60%]" : "h-[40%]"
              }`}
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className={`w-0.5 bg-accent/70 rounded-full transition-all ${
                !isMuted ? "animate-pulse h-[80%]" : "h-[20%]"
              }`}
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <span className="text-[9px] font-mono tracking-wider text-accent/70 uppercase">
            {isMuted ? "Audio Off" : "Audio On"}
          </span>
        </button>
      </div>

      {children}
    </>
  );
}

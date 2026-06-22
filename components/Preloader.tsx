"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const bootSequence = [
  { text: "NEURAL HANDSHAKE PROTOCOL // INITIATED", delay: 0 },
  { text: "MAPPING KINEMATICS ENVELOPE [6-DOF]...", delay: 80 },
  { text: "RS-485 DUPLEX BUS // LOCKED", delay: 60 },
  { text: "FORCE-REFLECTIVE HAPTIC LOOPS // VERIFIED", delay: 90 },
  { text: "ENCODER ARRAY [16-BIT ABS] // CALIBRATED", delay: 70 },
  { text: "POWER RAIL INJECTION // 24.8V NOMINAL", delay: 50 },
  { text: "JOINT SCAN [J1-J6] // ALL WITHIN TOLERANCE", delay: 100 },
  { text: "LATENCY BENCHMARK // 8.2ms RTT", delay: 60 },
  { text: "HARMONIC DRIVES // GEAR RATIO LOCKED", delay: 80 },
  { text: "TELEOPERATION INTERFACE // ONLINE", delay: 70 },
  { text: "SECURE CHANNEL // HANDSHAKE COMPLETE", delay: 120 },
];

const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}|/\\";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [titleText, setTitleText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const hexGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const target = "BIRBAL SAHNI";
    let frame = 0;
    const titleInterval = setInterval(() => {
      frame++;
      const result = target.split("").map((ch, i) => {
        if (ch === " ") return " ";
        if (frame > i * 2 + 5) return ch;
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }).join("");
      setTitleText(result);
      if (frame > target.length * 2 + 10) {
        setTitleText(target);
        setTitleRevealed(true);
        clearInterval(titleInterval);
      }
    }, 40);

    return () => clearInterval(titleInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const speed = prev < 30 ? Math.random() * 4 + 1 : prev < 70 ? Math.random() * 6 + 2 : Math.random() * 10 + 3;
        return Math.min(Math.round(prev + speed), 100);
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const logIndex = Math.min(
      Math.floor((progress / 100) * bootSequence.length),
      bootSequence.length - 1
    );

    const currentLogs = bootSequence.slice(0, logIndex + 1).map(l => l.text);
    setVisibleLogs(currentLogs);

    if (progress === 100) {
      const timeout = setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsDone(true);
            document.body.style.overflow = "auto";
          },
        });

        tl.to(".preloader-title", {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        })
        .to(".preloader-logs", {
          x: -40,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        }, "-=0.2")
        .to(".preloader-progress-bar", {
          scaleX: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        }, "-=0.2")
        .to(".preloader-percentage", {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, "-=0.3")
        .to(".preloader-hex-grid", {
          scale: 1.2,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        }, "-=0.4")
        .to(".preloader-container", {
          clipPath: "inset(50% 0% 50% 0%)",
          duration: 0.6,
          ease: "power4.inOut",
        }, "-=0.2");
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="preloader-container fixed inset-0 z-[95] flex flex-col justify-between bg-[#050208] text-white select-none overflow-hidden"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        ref={hexGridRef}
        className="preloader-hex-grid absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 40 L30 55 L5 40 L5 20 Z' fill='none' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/8 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] rounded-full bg-indigo-600/6 blur-[100px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent preloader-scanline"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex justify-between items-center p-6 sm:p-8 text-[9px] font-mono text-accent/30 tracking-[0.3em]">
        <span>SYS_LOADER_V3.0</span>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-400 blink-dot" />
          <span>NODE_BS_01</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12">
        <div className="preloader-title mb-12 text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-[-0.05em] text-white font-mono leading-none mb-3">
            {titleText}
          </h1>
          <div className={`h-px w-0 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto transition-all duration-1000 ease-out ${titleRevealed ? "w-48 sm:w-64 opacity-100" : "opacity-0"}`} />
          <p className={`text-[10px] font-mono tracking-[0.4em] uppercase text-accent/40 mt-4 transition-opacity duration-700 ${titleRevealed ? "opacity-100" : "opacity-0"}`}>
            Industrial Manufacturing // Teleoperation
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="preloader-logs font-mono text-[9px] sm:text-[10px] leading-relaxed tracking-wider mb-6 h-16 overflow-hidden flex flex-col justify-end">
            {visibleLogs.slice(-3).map((log, index) => (
              <div
                key={log}
                className={`transition-all duration-200 ${
                  index === visibleLogs.slice(-3).length - 1
                    ? "text-purple-200/80"
                    : "text-accent/25"
                }`}
              >
                <span className="text-accent/40 mr-1">&gt;</span> {log}
              </div>
            ))}
          </div>

          <div className="preloader-progress-bar w-full h-[2px] bg-purple-950/50 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-accent to-purple-400 transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent/30 blur-[8px]" />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <span className="text-[9px] font-mono tracking-[0.3em] text-accent/30 uppercase">
              {progress < 100 ? "Initializing Systems" : "Launch Ready"}
            </span>
            <span className="preloader-percentage text-5xl sm:text-6xl font-extralight text-white tracking-[-0.03em] leading-none tabular-nums">
              {progress.toString().padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end p-6 sm:p-8 text-[9px] font-mono text-accent/20 tracking-[0.2em]">
        <span>DELHI AI + ROBOTICS LAB</span>
        <span>TEAM BIRBAL SAHNI // 2026</span>
      </div>
    </div>
  );
}

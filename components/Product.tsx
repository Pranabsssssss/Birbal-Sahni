"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    num: "01",
    title: "Unskilled Labour Enablement",
    description:
      "FORGE bridges the skill gap in industrial manufacturing — enabling untrained operators to perform precision tasks through intuitive master-slave mirroring. No prior robotics training required.",
    details: ["SKILL_THRESHOLD: ZERO", "TRAINING_TIME: < 15MIN", "ERROR_RATE: < 0.3%"],
  },
  {
    num: "02",
    title: "Detachable Modular Design",
    description:
      "Quick-release joint modules allow the FORGE arm to be deployed, swapped, or maintained in under 60 seconds. Designed for factory-floor flexibility across multiple workstations.",
    details: ["SWAP_TIME: < 60S", "MODULES: 6 AXIS", "MOUNT: UNIVERSAL_CLAMP"],
  },
  {
    num: "03",
    title: "Sub-Millimeter Precision",
    description:
      "High-resolution magnetic encoder arrays coupled with closed-loop PID control achieve repeatable positioning under 0.1mm — matching industrial-grade CNC tolerances for manufacturing tasks.",
    details: ["RESOLUTION: 16-BIT", "ENCODERS: ABSOLUTE", "BACKLASH: < 0.02MM"],
  },
  {
    num: "04",
    title: "Real-Time Teleoperation",
    description:
      "Sub-10ms command relay enabling seamless remote manipulation with zero perceivable input lag. Built for high-frequency synchronization across the master-slave duplex interface.",
    details: ["LINK_LATENCY: < 8.4MS", "BUS: RS-485", "FREQ: 2.4/5.8GHZ"],
  },
  {
    num: "05",
    title: "Haptic Feedback Loops",
    description:
      "Integrated bilateral force sensing maps slave-arm load states back to the master controller, delivering precise tactile fidelity so operators can feel what the machine touches.",
    details: ["LOAD_CELLS: 6-AXIS", "SENSITIVITY: 0.05N", "FEEDBACK: PID_TUNED"],
  },
  {
    num: "06",
    title: "Industrial-Grade Durability",
    description:
      "Engineered for factory environments — dust-resistant joints, reinforced chassis linkages, and thermal-hardened servos rated for continuous 12-hour manufacturing shifts.",
    details: ["DUTY_CYCLE: 12H+", "IP_RATING: IP54", "TEMP: -10°C TO 60°C"],
  },
];

export default function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 0.8,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-32 overflow-hidden"
    >
      <div className="max-w-6xl relative z-10 pl-6 sm:pl-10 md:pl-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-gradient-to-r from-accent/60 to-transparent" />
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-accent/60">
            [ SYSTEM SPECIFICATION ]
          </span>
        </div>

        <h2
          ref={titleRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tighter leading-none mb-6"
        >
          <span className="text-white">The FORGE </span>
          <span className="text-accent italic font-light">Manipulator</span>
        </h2>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg text-muted max-w-3xl mb-16 sm:mb-20 leading-relaxed font-light"
        >
          A detachable, industrial-grade robotic manipulator engineered for the manufacturing floor.
          FORGE empowers unskilled workers to perform precision tasks through intuitive teleoperation — 
          bridging human gesture and mechanical execution with sub-millimeter accuracy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="pointer-events-auto glass-card tech-border rounded-sm p-7 flex flex-col justify-between min-h-[280px] group border-purple-500/5 relative overflow-hidden"
            >
              <div className="scan-bar" />

              <div>
                <div className="text-3xl font-extralight text-accent/15 tracking-tight font-mono mb-5 group-hover:text-accent/35 transition-colors duration-500">
                  {feature.num}
                </div>

                <h3 className="text-lg font-light text-white mb-3 tracking-wide">
                  {feature.title}
                </h3>

                <p className="text-sm text-[#eee9ff]/55 leading-relaxed font-light mb-5">
                  {feature.description}
                </p>
              </div>

              <div className="border-t border-purple-500/10 pt-4 flex flex-col gap-1 font-mono text-[10px] tracking-wider text-accent/35 group-hover:text-accent/65 transition-colors duration-500">
                {feature.details.map((detail, index) => (
                  <span key={index}>// {detail}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

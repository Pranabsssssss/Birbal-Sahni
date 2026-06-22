"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  badge?: "MENTOR" | "LEAD";
  bio: string;
  initials: string;
  status: string;
  hash: string;
  photo: string;
}

const team: TeamMember[] = [
  {
    name: "Parth Gade",
    role: "Project Mentor",
    badge: "MENTOR",
    bio: "8+ years in robotics with deep CAD design expertise. Mentored students to the FIRST Tech Challenge (USA) finals. Specialist in mechanical design, prototyping workflows, and competition-grade engineering systems.",
    initials: "PG",
    status: "LINK_ACTIVE",
    hash: "0x7F41B2D",
    photo: "https://assets.techforge.pranab.xyz/assets/Parth.png",
  },
  {
    name: "Pranab Saini",
    role: "Team Leader",
    badge: "LEAD",
    bio: "All-rounder fluent in CAD, software, and Arduino. State-level hackathon champion (1st place) and 4× science exhibition gold medalist. Designed and developed this entire website. Architects the full-stack hardware-software pipeline.",
    initials: "PS",
    status: "SYS_ON_LINE",
    hash: "0x9E20A1F",
    photo: "https://assets.techforge.pranab.xyz/assets/pranab.png",
  },
  {
    name: "Sidharth Jangid",
    role: "CAD & Design Lead",
    bio: "Skilled CAD designer who mastered SolidWorks during the workshop intensive. Academically excellent with a sharp eye for precision modeling, structural tolerances, and assembly-level mechanical design.",
    initials: "SJ",
    status: "LINK_STABLE",
    hash: "0x3C81F0E",
    photo: "https://assets.techforge.pranab.xyz/assets/Sidharth.png",
  },
  {
    name: "Deepanshu",
    role: "Software Engineer",
    bio: "Professional software engineer and web development expert. 2× science exhibition winner with robotics projects, CodeBour regionals qualifier, and WRO regionals competitor. Builds the real-time control software stack.",
    initials: "D",
    status: "LINK_STABLE",
    hash: "0x8B12C4D",
    photo: "https://assets.techforge.pranab.xyz/assets/Deepanshu.png",
  },
  {
    name: "Anshika Awasthi",
    role: "Research & Communications",
    bio: "Professional research analyst and expert social media strategist. Skilled video editor who has grown her capabilities across content production, documentation, and brand communications throughout the years.",
    initials: "AA",
    status: "CALIBRATING",
    hash: "0x5A90D7C",
    photo: "https://assets.techforge.pranab.xyz/assets/Anshika%20Awasthi.png",
  },
  {
    name: "Pushkar Pal",
    role: "Robotics Engineer",
    bio: "Strong robotics engineer with deep mechanical aptitude. 2× science exhibition winner with hands-on robotics builds. Expert in physical mechanics, joint assemblies, and electro-mechanical integration.",
    initials: "PP",
    status: "LINK_STABLE",
    hash: "0x2D71B8B",
    photo: "https://assets.techforge.pranab.xyz/assets/Pushkar.png",
  },
];

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      className="team-card group relative overflow-hidden rounded-sm pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden bg-[#0d0a18]">
        {!imgError ? (
          <img
            src={member.photo}
            alt={member.name}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              imgLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-110 brightness-110" : "scale-100 brightness-75"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-950/40 to-[#0d0a18]">
            <span className="text-5xl font-extralight text-accent/30 font-mono">
              {member.initials}
            </span>
          </div>
        )}

        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border border-t-2 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
          </div>
        )}

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "opacity-90" : "opacity-70"
          }`}
          style={{
            background: isHovered
              ? "linear-gradient(to top, #050208 0%, #050208dd 25%, #050208aa 45%, transparent 100%)"
              : "linear-gradient(to top, #050208 0%, #050208cc 20%, transparent 60%)",
          }}
        />

        <div className="team-card-scanline" />

        {member.badge && (
          <div className="absolute top-4 right-4 z-20">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-mono tracking-[0.25em] uppercase backdrop-blur-sm ${
                member.badge === "MENTOR"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  member.badge === "MENTOR" ? "bg-purple-400" : "bg-indigo-400"
                } blink-dot`}
              />
              {member.badge}
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[8px] font-mono tracking-[0.2em] text-accent/40 uppercase">
            {member.hash}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${
              member.status === "CALIBRATING" ? "bg-amber-400 blink-dot" : "bg-emerald-400"
            }`} />
            <span className="text-[8px] font-mono tracking-[0.3em] text-accent/40 uppercase">
              {member.status}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide leading-tight mb-1">
            {member.name}
          </h3>

          <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-accent/60 mb-0">
            {member.role}
          </p>

          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isHovered ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="h-px w-full bg-gradient-to-r from-purple-500/30 via-purple-400/20 to-transparent mb-3" />
            <p className="text-xs sm:text-sm text-[#eee9ff]/50 leading-relaxed font-light">
              {member.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-sm border border-purple-500/0 group-hover:border-purple-500/30 transition-all duration-500 pointer-events-none" />
      <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_30px_rgba(168,85,247,0.08)]" />
    </div>
  );
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const cards = gridRef.current?.querySelectorAll(".team-card");
      if (cards) {
        cards.forEach((card, i) => {
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
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-32 overflow-hidden"
    >
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gradient-to-r from-accent/60 to-transparent" />
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-accent/60">
            [ PERSONNEL ROSTER ]
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 sm:mb-20 gap-4">
          <h2
            ref={titleRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tighter leading-none"
          >
            <span className="text-white">The </span>
            <span className="text-accent italic font-light">Operators</span>
          </h2>
          <p className="text-xs font-mono tracking-[0.15em] text-accent/30 uppercase max-w-xs">
            6 LINKED NODES // ALL SYSTEMS NOMINAL
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {team.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

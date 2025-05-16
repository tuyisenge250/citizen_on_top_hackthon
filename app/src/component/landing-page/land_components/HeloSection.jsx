"use client";
import Image from "next/image";
import Link from "next/link";
import heroCar from "./../../../image/happy_citizen.png";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 px-6 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-between gap-12">
    
      <div className="absolute w-72 h-72 bg-blue-300 opacity-10 rounded-full top-0 left-0 blur-3xl animate-pulse-slow" />
      <div className="absolute w-96 h-96 bg-blue-200 opacity-10 rounded-full bottom-[-100px] right-[-100px] blur-3xl animate-pulse-slow" />

      
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-10 left-[-100px] w-20 opacity-20 animate-car-slide delay-[0s] z-0">
          <Image src={heroCar} alt="mini car" width={80} height={40} />
        </div>
        <div className="absolute bottom-20 left-[-150px] w-16 opacity-20 animate-car-slide delay-[3s] z-0">
          <Image src={heroCar} alt="mini car" width={64} height={32} />
        </div>
        <div className="absolute top-40 left-[-200px] w-12 opacity-20 animate-car-slide delay-[5s] z-0">
          <Image src={heroCar} alt="mini car" width={48} height={24} />
        </div>
      </div>

      {/* Mobile background car - static version */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center z-0 opacity-20 pointer-events-none">
        <Image
          src={heroCar}
          alt="Background Car"
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Text content - now first on mobile */}
      <div className="text-center md:text-left max-w-xl z-10 relative">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 leading-snug mb-6 md:shadow-none text-shadow-sm">
          A smoother experience and good governance shaped by your feedback and complaints.
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8 md:shadow-none text-shadow-xs">
            Citizen on Top is a platform established to provide all Rwandans with equal opportunity to share feedback and complaints about any public service       
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link href="/about" className="block w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-300 text-blue-900 font-semibold hover:bg-gray-100 hover:border-blue-300 transition shadow-sm">
              Learn More
            </button>
          </Link>
          <Link href="/start" className="block w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-900 text-white font-semibold relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 w-full h-full bg-blue-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out opacity-20" />
              <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center md:animate-marquee group-hover:animate-none opacity-50 text-sm text-white">
                🚗 &nbsp; 🚗 &nbsp; 🚗
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Car image - visible only on md screens and up */}
      <div className="hidden md:flex w-1/2 justify-center z-10">
        <div className="relative w-full max-w-md">
          {mounted && (
            <div className="car-zoom-container">
              <Image
                src={heroCar}
                alt="Driving School Illustration"
                className="w-full h-auto"
                priority
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes carZoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes carSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 200px));
          }
        }

        .animate-marquee {
          animation: marquee 5s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .car-zoom-container {
          animation: carZoom 10s ease-in-out infinite;
          transform-origin: center;
          will-change: transform;
        }

        .animate-car-slide {
          animation: carSlide 25s linear infinite;
          will-change: transform;
        }

        .delay-\\[3s\\] {
          animation-delay: 3s;
        }

        .delay-\\[5s\\] {
          animation-delay: 5s;
        }
        
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .text-shadow-xs {
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 768px) {
          .text-shadow-sm {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          }
          
          .text-shadow-xs {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          /* Disable animations on mobile */
          .animate-pulse-slow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
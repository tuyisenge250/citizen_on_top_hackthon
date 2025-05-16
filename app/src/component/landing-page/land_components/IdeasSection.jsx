"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, UserCheck, ClipboardCheck, FolderSearch, FileText   } from "lucide-react";
import { motion } from "framer-motion";

const ideas = [
  {
    icon: FileText,
    title: "Complaint Submission",
    desc: "Citizens can submit complaints or feedback about any public service through a user-friendly interface.",
  },
  {
    icon: FolderSearch,
    title: "Smart Categorization",
    desc: "Submissions are categorized and routed to the appropriate government agency automatically.",
  },
  {
    icon: ClipboardCheck,
    title: "Status Tracking",
    desc: "Users can track the status of their submissions in real-time, increasing transparency.",
  },
  {
    icon: UserCheck,
    title: "Government Response",
    desc: "Government officials have a simple admin interface to respond and manage submissions efficiently.",
  },
  {
    icon: LayoutDashboard,
    title: "Scalable Design",
    desc: "The system is built for usability, scalability, and extensibility, with options for dashboards and analytics.",
  },
];


// const ideas = [
//   {
//     icon: Lightbulb,
//     title: "Innovative Learning",
//     desc: "We use digital tools and interactive methods to simplify learning traffic laws.",
//   },
//   {
//     icon: BookOpenCheck,
//     title: "Complete Preparation",
//     desc: "Our lessons cover everything from theory to practical driving test tips.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Safety First",
//     desc: "We emphasize road safety and regulations to build responsible drivers.",
//   },
// // ];

const iconColors = ["text-blue-700", "text-blue-500", "text-indigo-600", "text-sky-600"];

export default function IdeasSection() {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % iconColors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-20 px-6 md:px-20 lg:px-32 relative">
    
      <div className="absolute top-4 right-4 w-24 h-24 bg-blue-500 rounded-full opacity-30"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-10 rounded-full top-[-200px] right-0 blur-3xl animate-pulse-slow" />

      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-20 w-8 h-8 bg-blue-300 rounded-full opacity-20 animate-moveCircle"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-200 rounded-full opacity-15 animate-moveCircle"></div>
        <div className="absolute bottom-20 left-40 w-10 h-10 bg-blue-400 rounded-full opacity-25 animate-moveCircle"></div>
        <div className="absolute top-60 left-60 w-5 h-5 bg-blue-500 rounded-full opacity-30 animate-moveCircle"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
        >
          Why Learn with Citizen on Top?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-blue-700 text-lg max-w-3xl mx-auto"
        >
          We combine modern technology, local knowledge, and dedication to make citizen engagement transparent, efficient, and impactful.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8">
        {ideas.map((idea, index) => {
          const Icon = idea.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7, type: "spring" }}
              className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300 p-6 text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`bg-blue-100 p-3 rounded-full transition-colors duration-700`}>
                  <Icon className={`w-8 h-8 transition-all duration-1000 ${iconColors[(colorIndex + index) % iconColors.length]}`} />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700 transition">
                  {idea.title}
                </h3>
              </div>
              <p className="text-blue-700">{idea.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* CSS for Animation */}
      <style jsx>{`
        @keyframes moveCircle {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
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
         .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .animate-moveCircle {
          animation: moveCircle 10s linear infinite alternate;
        }
      `}</style>
    </section>
  );
}

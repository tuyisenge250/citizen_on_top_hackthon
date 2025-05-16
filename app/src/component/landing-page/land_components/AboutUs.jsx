"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const featuresLeft = [
  "Encourage clear and constructive citizen feedback",
  "Ensure transparency, integrity, and responsiveness",
  "Simplify the process for submitting complaints and suggestions",
];

const featuresRight = [
  "Empower citizens with knowledge of their rights and responsibilities",
  "Utilize advanced tools to track and resolve issues efficiently",
  "Promote continuous improvement through active community engagement",
];

export default function AboutUsTree() {
  const controls = useAnimation();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const dividerRef = useRef(null);
  
  const leftInView = useInView(leftRef, { once: true, amount: 0.3 });
  const rightInView = useInView(rightRef, { once: true, amount: 0.3 });
  const dividerInView = useInView(dividerRef, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (dividerInView) {
      controls.start("visible");
    }
  }, [controls, dividerInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };
  
  const dividerVariants = {
    hidden: { height: "0%" },
    visible: { 
      height: "100%", 
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Section */}
          <motion.div 
            ref={leftRef}
            className="flex-1"
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl font-bold text-blue-900 mb-6 relative"
              variants={itemVariants}
              custom={0}
            >
              Who We Are
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-900 rounded-full"></span>
            </motion.h2>
            
            <motion.p 
              className="text-gray-700 mb-8 leading-relaxed"
              variants={itemVariants}
              custom={1}
            >
              At Citizen on Top, we empower individuals to voice their concerns, provide feedback, and participate in improving community services. We are dedicated to transparent, professional, and effective engagement.
            </motion.p>
            
            <div className="space-y-6 mb-8">
              {featuresLeft.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-start gap-3 group"
                  variants={itemVariants}
                  custom={idx + 2}
                  whileHover={{ x: 5 }}
                >
                  <div className="rounded-full bg-blue-100 p-1 text-blue-900 mt-1 transform group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800 group-hover:text-blue-900 transition-colors duration-300">{item}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.p 
              className="text-gray-700 italic bg-blue-50 p-4 rounded-lg border-l-4 border-blue-900"
              variants={itemVariants}
              custom={5}
            >
              Every citizen’s voice matters and is supported on their path to making a difference.
            </motion.p>

            <motion.div 
              className="mt-10 text-gray-800 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              custom={6}
              whileHover={{ y: -5 }}
            >
              <p className="font-bold uppercase text-blue-900">CITIZEN ON TOP</p>
              <p className="flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Nyarugenge, Kigali, Rwanda
              </p>
              <p className="mt-3 text-gray-600 border-t border-gray-100 pt-3">
                Facilitating community feedback and complaint management for over 15 years
              </p>
            </motion.div>
          </motion.div>

          {/* Center Divider */}
          <div className="hidden md:flex items-center justify-center relative">
            <motion.div 
              ref={dividerRef}
              className="w-1 bg-gradient-to-b from-blue-900 to-blue-300 rounded-full"
              style={{ height: "100%" }}
              initial="hidden"
              animate={controls}
              variants={dividerVariants}
            />
            <div className="absolute top-1/2 -translate-y-1/2">
              <motion.div 
                className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white"
                initial={{ scale: 0 }}
                animate={dividerInView ? { scale: 1, rotate: 360 } : { scale: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Right Section */}
          <motion.div 
            ref={rightRef}
            className="flex-1"
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.p 
              className="text-gray-700 mb-8 leading-relaxed bg-blue-50 p-5 rounded-lg border-r-4 border-blue-900"
              variants={itemVariants}
              custom={0}
            >
              Our vision at Citizen on Top is to be the trusted platform for citizen voices, fostering open dialogue and efficient resolution of community concerns.
            </motion.p>
            
            <motion.h3 
              className="text-2xl font-bold text-blue-900 mb-6 relative"
              variants={itemVariants}
              custom={1}
            >
              We envision a future where every citizen has:
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-900 rounded-full"></span>
            </motion.h3>
            
            <div className="space-y-6 mb-8">
              {featuresRight.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-start gap-3 group"
                  variants={itemVariants}
                  custom={idx + 2}
                  whileHover={{ x: 5 }}
                >
                  <div className="rounded-full bg-blue-100 p-1 text-blue-900 mt-1 transform group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800 group-hover:text-blue-900 transition-colors duration-300">{item}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="p-6 bg-white rounded-lg shadow-md border-t-4 border-blue-900 hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              custom={5}
              whileHover={{ y: -5 }}
            >
              <p className="font-bold text-blue-900 uppercase">Committed to Service Excellence</p>
              <p className="mt-3 text-gray-600">
                We continuously refine our tools and practices to create a more inclusive and effective platform for citizen feedback and complaints.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

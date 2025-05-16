"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactComponent() {
  const [copied, setCopied] = useState({ email: false, phone: false });
  const [activeSection, setActiveSection] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [contactMethod, setContactMethod] = useState('email');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
    }, 2000);
  };

  useEffect(() => {
    if (hoverCount > 3 && !showTooltip) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  }, [hoverCount]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
    },
    tap: { scale: 0.95 }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" 
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-4xl font-bold text-center text-blue-900 mb-4"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        Contact Us
      </motion.h1>
      
      <motion.p 
        className="text-lg text-center text-gray-600 mb-8"
        variants={itemVariants}
      >
        Do you have a question? Talk to us or contact us via email or WhatsApp.
      </motion.p>

      <motion.div className="mb-6 flex justify-center" variants={itemVariants}>
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <motion.button
            className={`py-2 px-4 rounded-md transition-all duration-300 ${contactMethod === 'email' ? 'bg-blue-900 text-white' : 'text-gray-700'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactMethod('email')}
          >
            Email
          </motion.button>
          <motion.button
            className={`py-2 px-4 rounded-md transition-all duration-300 ${contactMethod === 'phone' ? 'bg-blue-900 text-white' : 'text-gray-700'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactMethod('phone')}
          >
            Phone
          </motion.button>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {contactMethod === 'email' ? (
          <motion.div 
            key="email"
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-transparent"
              whileHover={{ 
                backgroundColor: "rgba(239, 246, 255, 1)",
                borderColor: "#1e3a8a", 
                transition: { duration: 0.2 } 
              }}
              onHoverStart={() => {
                setActiveSection('email');
                setHoverCount(prev => prev + 1);
              }}
              onHoverEnd={() => setActiveSection(null)}
              animate={activeSection === 'email' ? { y: [0, -5, 0], transition: { duration: 0.5 } } : {}}
            >
              <div className="flex items-center mb-3 md:mb-0">
                <motion.div 
                  className="bg-blue-100 p-3 rounded-full mr-4"
                  whileHover={{ backgroundColor: "#dbeafe" }}
                  animate={activeSection === 'email' ? pulseAnimation : {}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <motion.p 
                    className="font-medium"
                    whileHover={{ color: "#1e3a8a" }}
                  >
                    benjaminwell250@gmail.com
                  </motion.p>
                </div>
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
                onClick={() => copyToClipboard("magnifiqueni01@gmail.com", "email")}
              >
                {copied.email ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      Copied!
                    </motion.span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Email
                  </>
                )}
              </motion.button>
            </motion.div>
            
            <motion.div className="mt-4 flex justify-center">
              <motion.a 
                href={`mailto:benjaminwell250@gmail.com`}
                className="inline-flex items-center text-blue-900 hover:text-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
                Open in Email Client
              </motion.a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="phone"
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-transparent"
              whileHover={{ 
                backgroundColor: "rgba(239, 246, 255, 1)",
                borderColor: "#1e3a8a",
                transition: { duration: 0.2 } 
              }}
              onHoverStart={() => {
                setActiveSection('phone');
                setHoverCount(prev => prev + 1);
              }}
              onHoverEnd={() => setActiveSection(null)}
              animate={activeSection === 'phone' ? { y: [0, -5, 0], transition: { duration: 0.5 } } : {}}
            >
              <div className="flex items-center mb-3 md:mb-0">
                <motion.div 
                  className="bg-green-100 p-3 rounded-full mr-4"
                  whileHover={{ backgroundColor: "#dcfce7" }}
                  animate={activeSection === 'phone' ? pulseAnimation : {}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-sm text-gray-500">Telefone:</p>
                  <motion.p 
                    className="font-medium"
                    whileHover={{ color: "#1e3a8a" }}
                  >
                    222233
                  </motion.p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                {/* <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  onClick={() => window.open("https://wa.me/250780211466", "_blank")}
                  onClick={() => window.open("https://wa.me/250780211466", "_blank")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </motion.button> */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  onClick={() => copyToClipboard("222333", "phone")}
                >
                  {copied.phone ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        Copied!
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div className="mt-4 flex justify-center">
              <motion.a 
                href={`tel:0780211466`}
                className="inline-flex items-center text-blue-900 hover:text-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-blue-900 text-white p-3 rounded-lg shadow-lg max-w-xs"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <p className="text-sm">Pro tip: Click any contact method to easily reach out!</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mt-8 text-center"
        variants={itemVariants}
      >
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 relative overflow-hidden group"
          onMouseEnter={() => setHoverCount(prev => prev + 1)}
        >
          <motion.span 
            className="absolute inset-0 bg-blue-700 rounded-full" 
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ 
              scale: 1.5, 
              opacity: 0.2,
              transition: { duration: 0.6 } 
            }}
          />
          <span className="relative z-10">Contact Us now</span>
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="mt-6 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <p>Available 24/7</p>
      </motion.div>
    </motion.div>
  );
}
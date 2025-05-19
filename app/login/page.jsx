"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import heroCar from "./../src/image/happy_citizen.png";
import massBalance from "./../src/image/massBalance.png"
import { useRouter } from 'next/navigation';

export default function DrivingLoginPortal() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Form validation function
  const validateForm = () => {
    const errors = {};
    if (!formState.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formState.password) {
      errors.password = "Password is required";
    } else if (formState.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    return errors;
  };

    async function handleSubmit(e) {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

    try {
           const formJson = JSON.stringify(formState)
            const res = await fetch("http://localhost:3000/api/auth/login ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: formJson,
                credentials: "include"
            });
            
            const successInfo= await res.json();
            
            if (!res.ok) {
                setError(successInfo.error || "Check phone number nor password");
                return;
            }
            // localStorage.setItem('id',infoGetted.user.id);
            // if(fromOtherPage){
            //     router.replace(fromOtherPage)
            //     localStorage.removeItem("pathToBack")
            //     return
            // }
            localStorage.setItem("citizenId", successInfo.user.id)
            router.push("/dashboard");
        } catch (error) {
            setError(error.message);
        } finally{
            setIsLoading(false);
        }
      
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex flex-col md:flex-row items-center justify-center">
      {/* Background blobs */}
      <div className="absolute w-72 h-72 bg-blue-300 opacity-10 rounded-full top-0 left-0 blur-3xl animate-pulse-slow" />
      <div className="absolute w-96 h-96 bg-blue-200 opacity-10 rounded-full bottom-[-100px] right-[-100px] blur-3xl animate-pulse-slow" />
      
      {/* Car animations container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Road line at the bottom */}
        <div className="absolute bottom-20 left-0 right-0 h-1 bg-gray-300 z-0" />
        <div className="absolute bottom-20 left-0 right-0 h-1 bg-gray-300 z-0">
          <div className="h-full w-full flex items-center">
            <div className="animate-dashed-line">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-1 w-12 bg-gray-500 mr-8 inline-block" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main car animation */}
        <div className={`absolute bottom-24 left-[-200px] ${mounted ? "animate-car-drive-repeat" : ""} z-10`}>
          <div className="relative">
            <motion.div 
              animate={{ 
                y: [0, -3, 0, -2, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut" 
              }}
            >
              <Image 
                src={heroCar} 
                alt="Driving car" 
                width={180} 
                height={90} 
                className="transform -scale-x-100" 
                priority 
              />
            </motion.div>
            
            {/* Car shadow */}
            <div className="absolute bottom-[-10px] left-5 right-5 h-3 bg-gray-900 opacity-20 blur-sm rounded-full" />
            
            {/* Wheel animation */}
            <div className="absolute bottom-1 left-10 w-6 h-6 rounded-full border-2 border-gray-700 bg-gray-800 animate-spin" />
            <div className="absolute bottom-1 right-12 w-6 h-6 rounded-full border-2 border-gray-700 bg-gray-800 animate-spin" />
          </div>
        </div>
        
        {/* Small cars in background */}
        <div className="absolute top-32 right-[-50px] w-12 opacity-20 animate-car-slide-reverse delay-[2s] z-0">
          <Image src={heroCar} alt="mini car" width={48} height={24} />
        </div>
        <div className="absolute top-60 right-[-80px] w-16 opacity-20 animate-car-slide-reverse delay-[7s] z-0">
          <Image src={heroCar} alt="mini car" width={64} height={32} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        {/* Left side - Car illustration visible on medium screens and up */}
        <div className="hidden md:block w-full md:w-1/2 z-10 pr-10">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Welcome Back to Citizen on Top
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                 Continue your journey to becoming an empowered citizen with our comprehensive civic services.              
             </p>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-blue-900 font-bold">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="ml-4 text-gray-600">Join <span className="font-semibold">5000+</span> citizens</p>
              </div>
            </div>
            
            {/* Traffic light decoration */}
            <div className="absolute -top-10 -right-4 w-25 h-15 bg-gray-800 rounded-md flex flex-col items-center justify-between py-2 z-20">
              {/* <div className={`w-5 h-5 rounded-full ${mounted ? 'bg-red-500' : 'bg-gray-600'}`} />
              <div className={`w-5 h-5 rounded-full ${mounted ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors delay-1000 duration-500`} />
              <div className={`w-5 h-5 rounded-full ${mounted ? 'bg-green-500' : 'bg-gray-600'} transition-colors delay-2000 duration-500`} /> */}
             <Image src={massBalance} alt="" width={100} height={100}/>
            </div>
          </motion.div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900">Login to Your Account</h2>
              <p className="text-gray-600 mt-2">Access your compliants and feedback on public service</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <div className={`relative border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition-all duration-200`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="block w-full text-black pl-10 pr-3 py-3 border-0 rounded-lg focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                  <button type="button" className="text-sm text-blue-900 hover:text-blue-700">Forgot Password?</button>
                </div>
                <div className={`relative border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition-all duration-200`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                    className="block w-full text-black pl-10 pr-10 py-3 border-0 rounded-lg focus:outline-none"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
              </div>
              
              <div className="flex items-center mb-6">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formState.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition duration-200 relative overflow-hidden group disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign in to Dashboard"}
                </span>
                <span className="absolute inset-0 w-full h-full bg-blue-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out opacity-20" />
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-900 font-medium hover:underline transition duration-200">
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes carDriveRepeat {
          0% {
            transform: translateX(0) translateZ(0);
          }
          16% {
            transform: translateX(calc(100vw + 300px)) translateZ(0);
          }
          17% {
            transform: translateX(-200px) translateZ(0);
          }
          33% {
            transform: translateX(calc(100vw + 300px)) translateZ(0);
          }
          34% {
            transform: translateX(-200px) translateZ(0);
          }
          50% {
            transform: translateX(calc(100vw + 300px)) translateZ(0);
          }
          51% {
            transform: translateX(-200px) translateZ(0);
          }
          67% {
            transform: translateX(calc(100vw + 300px)) translateZ(0);
          }
          68% {
            transform: translateX(-200px) translateZ(0);
          }
          84% {
            transform: translateX(calc(100vw + 300px)) translateZ(0);
          }
          85% {
            transform: translateX(-200px) translateZ(0);
          }
          100% {
            transform: translateX(calc(50vw - 100px)) translateZ(0);
          }
        }

        @keyframes carSlideReverse {
          0% {
            transform: translateX(0) translateZ(0);
          }
          100% {
            transform: translateX(calc(-100vw - 200px)) translateZ(0);
          }
        }

        @keyframes dashedLine {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-300px);
          }
        }

        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .animate-car-drive-repeat {
          animation: carDriveRepeat 200s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform;
        }

        .animate-car-slide-reverse {
          animation: carSlideReverse 280s linear infinite;
          will-change: transform;
        }

        .animate-dashed-line {
          display: flex;
          animation: dashedLine 20s linear infinite;
          will-change: transform;
        }

        .delay-\\[2s\\] {
          animation-delay: 2s;
        }

        .delay-\\[7s\\] {
          animation-delay: 7s;
        }
      `}</style>
    </section>
  );
}
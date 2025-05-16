"use client";
import { Menu, Button, Select, Badge, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import logo from "./../src/image/happy_citizen.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BurgerButton from "./Humburger";
import useWindowDimensions from "../hooks/useScreenSize";
import { BellOutlined, QuestionCircleOutlined, GiftOutlined, StarOutlined } from "@ant-design/icons";

const items = [
  { key: 1, label: <Link href="/">Home</Link> },
  { key: 2, label: <Link href="/">feedback/complaint</Link> },
  { key: 3, label: <Link href="#about">About Us</Link> },
  { key: 5, label: <Link href="#contact">Contact Us</Link> },
];

const languageOptions = [
  { 
    value: 'en', 
    label: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-3 bg-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="bg-red-600 w-1/3 h-full"></div>
            <div className="bg-white w-1/3 h-full"></div>
            <div className="bg-blue-600 w-1/3 h-full"></div>
          </div>
        </div>
        <span>English</span>
      </div>
    )
  },
  { 
    value: 'rw', 
    label: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-3 bg-blue-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400"></div>
        </div>
        <span>Kinyarwanda</span>
      </div>
    )
  },
  { 
    value: 'fr', 
    label: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-3 flex">
          <div className="bg-blue-700 w-1/3 h-full"></div>
          <div className="bg-white w-1/3 h-full"></div>
          <div className="bg-red-600 w-1/3 h-full"></div>
        </div>
        <span>Français</span>
      </div>
    )
  },
];

function NavHeader() {
  const { width } = useWindowDimensions();
  const [isClosed, setIsClosed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showPromoAlert, setShowPromoAlert] = useState(false);
  const [forceMobile, setForceMobile] = useState(true);
  const currentPath = usePathname();
  
  // Correctly update the view after the component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Set initial layout based on screen size
    const checkScreenSize = () => {
      const isMobile = window.innerWidth <= 768;
      setForceMobile(isMobile);
    };
    
    // Check immediately and then on resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Use the forceMobile state rather than calculating inside render
  const isDesktop = !forceMobile;

  const selectedKey =
    items.find((item) => item.label.props.href === currentPath)?.key || "1";

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <>
      {showPromoAlert && (
        <div className="w-full bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white py-3 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white transform -translate-y-1/2"></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2">
            <GiftOutlined className="text-yellow-300 text-xl animate-pulse" />
            <span className="font-medium text-sm sm:text-base">
              <span className="hidden sm:inline">Special offer:</span> Get 30% off your first month!
              <div className="sm:inline sm:ml-1">
                Use code: <span className="font-bold bg-yellow-400 text-blue-900 px-2 py-1 rounded ml-1">WELCOME30</span>
              </div>
            </span>
          </div>
          <button 
            className="absolute right-2 top-2 text-white hover:text-gray-200 transition-all hover:scale-110" 
            onClick={() => setShowPromoAlert(false)}
            aria-label="Close promotion"
          >
            ✕
          </button>
        </div>
      )}
      <header
        className="sticky top-0 z-50 w-full bg-white shadow-md flex justify-between items-center py-4 px-4 md:px-8 lg:px-16"
        style={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
        }}
      >
        {isClient && isDesktop ? (
          <>
            <div className="flex items-center">
              <Image src={logo} alt="logo" height={37} />
            </div>
            
            <div className="flex items-center justify-center">
              <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[String(selectedKey)]}
                items={items}
                style={{
                  flex: 1,
                  border: "none",
                  width: "600px",
                  fontWeight: 600,
                }}
                className="fixed-menu"
                disabledOverflow={false}
              />
              <div className="ml-4">
                <Select
                  defaultValue="en"
                  onChange={handleLanguageChange}
                  options={languageOptions}
                  style={{ width: 130 }}
                  dropdownStyle={{ borderRadius: '8px', overflow: 'hidden' }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4">
                <Tooltip title="Help Center" placement="bottom">
                  <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors">
                    <QuestionCircleOutlined className="text-lg text-gray-600 hover:text-blue-600 transition-colors" />
                  </button>
                </Tooltip>
                <Tooltip title="Notifications" placement="bottom">
                  <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors relative">
                    <Badge 
                      count={2} 
                      size="small" 
                      style={{ backgroundColor: '#FF4D4F', boxShadow: '0 0 0 2px white' }}
                    >
                      <BellOutlined className="text-lg text-gray-600 hover:text-blue-600 transition-colors" />
                    </Badge>
                  </button>
                </Tooltip>
              </div>
              
              <div className="flex gap-3">
                <Link href="/login">
                  <Button
                    style={{
                      background: "#ffffff",
                      color: "#041738",
                      borderColor: "#041738",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                      borderRadius: "6px",
                      height: "38px"
                    }}
                    className="login-btn hover:bg-gray-50 hover:shadow-sm"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    style={{
                      background: "#041738",
                      color: "#fff",
                      borderColor: "#041738",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                      borderRadius: "6px",
                      height: "38px"
                    }}
                    className="signup-btn hover:bg-blue-900 hover:shadow-md"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Image src={logo} alt="logo" width={45} height={45} />
            </div>
            
            <div className="flex justify-center items-center mx-2">
              <Select
                defaultValue="en"
                onChange={handleLanguageChange}
                options={languageOptions}
                style={{ width: 110 }}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ borderRadius: '8px', overflow: 'hidden' }}
                className="hover:shadow-sm transition-shadow"
              />
            </div>
            
            {isClient && (
              <div className="flex items-center">
                <BurgerButton isClosed={isClosed} setIsClosed={setIsClosed} />
              </div>
            )}
            
            {isClosed && (
              <div className="absolute top-full left-0 right-0 w-full bg-white flex flex-col p-4 gap-3 shadow-lg z-50 border-t border-gray-100 rounded-b-xl animate-slideDown">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                  <Badge count={2} size="small" style={{ backgroundColor: '#FF4D4F' }}>
                    <Button 
                      type="text" 
                      icon={<BellOutlined className="text-blue-700" />} 
                      className="flex items-center font-medium hover:bg-blue-50 hover:text-blue-800 text-sm"
                    >
                      Notifications
                    </Button>
                  </Badge>
                  <Button 
                    type="text" 
                    icon={<QuestionCircleOutlined className="text-blue-700" />} 
                    className="flex items-center font-medium hover:bg-blue-50 hover:text-blue-800 text-sm"
                  >
                    Help Center
                  </Button>
                </div>
                
                {items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.label.props.href}
                    className={`p-3 rounded-md font-semibold flex items-center transition-all ${
                      currentPath === item.label.props.href
                        ? "text-blue-700 bg-blue-50 shadow-sm"
                        : "text-gray-800 hover:bg-gray-50 hover:translate-x-1"
                    }`}
                    onClick={() => setIsClosed(!isClosed)}
                  >
                    {item.label.props.children}
                  </Link>
                ))}
                
                <div className="flex flex-col gap-3 mt-4">
                  <Link href="/login" onClick={() => setIsClosed(!isClosed)}>
                    <Button
                      style={{
                        background: "#ffffff",
                        color: "#041738",
                        borderColor: "#041738",
                        fontWeight: "bold",
                        width: "100%",
                        padding: "10px 16px",
                        height: "auto",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                      className="login-btn hover:bg-gray-50 hover:shadow-md"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsClosed(!isClosed)}>
                    <Button
                      style={{
                        background: "#041738",
                        color: "#fff",
                        borderColor: "#041738",
                        fontWeight: "bold",
                        width: "100%",
                        padding: "10px 16px",
                        height: "auto",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                      className="signup-btn hover:bg-blue-900 hover:shadow-md"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </header>
      
      {/* Add keyframes for slideDown animation */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .ant-menu {
            display: none !important;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Fix for hydration issues in Next.js */
        html {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </>
  );
}

export default NavHeader;
import Image from "next/image";
import Logo from "./../src/image/happy_citizen.png";

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  PlaySquare,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 space-y-4 md:space-y-0">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src={Logo}
            alt="Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>

        {/* Center Text */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; 2025 Citizen on Top. All rights reserved.
          </p>
          <p className="text-sm">
            Developed by{" "}
            <a
              href="https://benjamintuyisenge-phi.vercel.app/"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BenBrand
            </a>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-300" aria-label="TikTok">
            <PlaySquare size={20} />
          </a>
          <a href="#" className="hover:text-blue-300" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-blue-300" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-blue-300" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-blue-300" aria-label="YouTube">
            <Youtube size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

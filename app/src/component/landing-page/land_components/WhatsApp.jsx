import { MessageCircle } from "lucide-react";  // Ensure lucide-react is installed
import { motion } from "framer-motion";  // Ensure framer-motion is installed

const WhatsApp=()=>{
  return (
    <motion.a
      href="https://wa.me/250788123456"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-xl"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}

export default WhatsApp;

import { LucideIcon } from "lucide-react";

interface CardProps {
  value: string;
  icon: LucideIcon;
  text: string;
  className?: string;
}

export default function Card({ value, icon: Icon, text, className }: CardProps) {
  return (
    <div className={`
      flex items-center justify-between 
      py-4 px-6 border rounded-lg 
      border-gray-300 hover:border-blue-500
      hover:bg-gray-200
      transition-all duration-200 
      hover:shadow-xl 
      ${className}
    `}>
      <div className="flex items-center gap-1 justify-between">
        <div className="sm:p-2 rounded-full bg-blue-50">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-gray-800 font-bold text-lg sm:text-xl mr-1">{text.toUpperCase()}</p>
      </div>
      <span className="rounded-full bg-blue-600 text-white px-4 py-1.5 text-sm font-medium">
        {value}
      </span>
    </div>
  );
}
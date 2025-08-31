import { cn } from "@/lib/utils";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  className?: string;
}

const PromoBanner = ({ title, subtitle, className }: PromoBannerProps) => {
  return (
    <div className={cn(
      "relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-gradient-to-r from-teal-400 to-cyan-500 p-6 text-white",
      className
    )}>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg opacity-90">{subtitle}</p>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-4 translate-y-4"></div>
    </div>
  );
};

export default PromoBanner;
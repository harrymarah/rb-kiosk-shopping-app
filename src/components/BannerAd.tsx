import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/banner-sf-4pk.png";

interface BannerAdProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const BannerAd = ({ 
  title = "Your Advertisement Here", 
  subtitle = "Contact us to advertise your brand",
  className = ""
}: BannerAdProps) => {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    navigate("/red-bull-products");
  };

  return (
    <div 
      className={`w-full max-w-4xl mx-auto rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity ${className}`}
      onClick={handleBannerClick}
    >
      <img 
        src={bannerImage} 
        alt="Red Bull Products - Click to view all" 
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default BannerAd;
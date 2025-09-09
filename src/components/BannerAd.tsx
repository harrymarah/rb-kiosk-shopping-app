import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/red-bull-banner-ad.jpg";

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
    <div className="w-full flex justify-center">
      <div 
        className={`inline-block max-w-4xl max-h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity ${className}`}
        onClick={handleBannerClick}
      >
        <img 
          src={bannerImage} 
          alt="Red Bull Products - Click to view all" 
          className="max-w-full max-h-48 h-auto object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default BannerAd;
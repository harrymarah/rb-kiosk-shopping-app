import { Truck, Clock, Car, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WelcomeSection = () => {
  return (
    <section className="bg-grocery-blue px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        {/* Delivery Icons Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
              <Car className="h-8 w-8 text-white" />
            </div>
            <p className="text-white text-xs font-medium">HOME DELIVERY</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <p className="text-white text-xs font-medium">EXPRESS</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <p className="text-white text-xs font-medium">CLICK & COLLECT</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-grocery-blue rounded-2xl py-4 text-base font-semibold transition-all"
          >
            Get Whoosh delivery
          </Button>
          <Button 
            className="w-full bg-white text-grocery-blue hover:bg-white/90 rounded-2xl py-4 text-base font-bold shadow-lg"
          >
            Book a slot
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

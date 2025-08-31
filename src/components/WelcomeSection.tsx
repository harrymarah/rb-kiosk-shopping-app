import { Truck, Clock, Car, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WelcomeSection = () => {
  return (
    <section className="bg-grocery-blue px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Delivery Icons Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white/30 rounded-3xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
              <Car className="h-10 w-10 text-white" />
            </div>
            <p className="text-white text-sm font-bold tracking-wide">HOME DELIVERY</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white/30 rounded-3xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <p className="text-white text-sm font-bold tracking-wide">EXPRESS</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white/30 rounded-3xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <p className="text-white text-sm font-bold tracking-wide">CLICK & COLLECT</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-grocery-blue rounded-3xl py-6 text-lg font-bold transition-all duration-300 shadow-lg"
          >
            Get Whoosh delivery
          </Button>
          <Button 
            className="w-full bg-white text-grocery-blue hover:bg-white/90 rounded-3xl py-6 text-lg font-bold shadow-xl border-2 border-white"
          >
            Book a slot
            <ChevronRight className="h-6 w-6 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

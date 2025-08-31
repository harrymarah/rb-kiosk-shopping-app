import { Truck, Clock, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WelcomeSection = () => {
  return (
    <section className="bg-primary px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        {/* Delivery Options */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="text-white text-center">
              <p className="text-xs">DELIVERY</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="text-white text-center">
              <p className="text-xs">EXPRESS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-white text-center">
              <p className="text-xs">PICKUP</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-full py-6"
          >
            Get Whoosh delivery
          </Button>
          <Button 
            className="w-full bg-white text-primary hover:bg-white/90 rounded-full py-6 font-semibold"
          >
            Book a slot
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

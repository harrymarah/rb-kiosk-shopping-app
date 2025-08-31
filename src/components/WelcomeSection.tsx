import { Truck, Clock, Car } from 'lucide-react'
import { useState } from 'react'

const WelcomeSection = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<'home' | 'express' | 'collect'>('home');

  const deliveryOptions = [
    { id: 'home', icon: Car, label: 'HOME DELIVERY', description: '1-2 hours' },
    { id: 'express', icon: Truck, label: 'EXPRESS', description: '30 mins' },
    { id: 'collect', icon: Clock, label: 'CLICK & COLLECT', description: 'Pick up today' },
  ];

  return (
    <section className="bg-card px-4 py-8 border-b">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-lg font-bold text-foreground mb-6 text-center">Choose your delivery option</h3>
        
        {/* Delivery Options as Radio Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {deliveryOptions.map((option) => (
            <label
              key={option.id}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedDelivery === option.id
                  ? 'border-grocery-blue bg-grocery-blue/10 shadow-lg'
                  : 'border-border bg-background hover:border-grocery-blue/50'
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={option.id}
                checked={selectedDelivery === option.id}
                onChange={(e) => setSelectedDelivery(e.target.value as any)}
                className="sr-only"
              />
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  selectedDelivery === option.id
                    ? 'bg-grocery-blue text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <option.icon className="h-8 w-8" />
                </div>
                <p className={`text-xs font-bold mb-1 ${
                  selectedDelivery === option.id ? 'text-grocery-blue' : 'text-foreground'
                }`}>
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

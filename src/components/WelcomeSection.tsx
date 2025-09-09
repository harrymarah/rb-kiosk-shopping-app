import { Truck, Car, Zap } from 'lucide-react'
import { useDelivery } from '@/contexts/DeliveryContext'

const WelcomeSection = () => {
  const { selectedDelivery, setSelectedDelivery } = useDelivery();

  const deliveryOptions = [
    { id: 'home', icon: Truck, label: 'HOME DELIVERY', description: 'from tomorrow' },
    { id: 'express', icon: Zap, label: 'EXPRESS', description: '30 mins' },
    { id: 'collect', icon: Car, label: 'CLICK & COLLECT', description: 'Pick up today' },
  ];

  return (
    <section className="bg-gray-50 px-4 py-8 border-b border-gray-200">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Choose your delivery option</h3>
        
        {/* Delivery Options as Radio Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {deliveryOptions.map((option) => (
            <label
              key={option.id}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 ${
                selectedDelivery === option.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
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
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-sm ${
                  selectedDelivery === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <option.icon className="h-8 w-8" />
                </div>
                <p className={`text-sm font-bold mb-2 ${
                  selectedDelivery === option.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.label}
                </p>
                <p className="text-sm text-gray-600 font-medium">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

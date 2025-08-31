import { Star, Truck, ReceiptPoundSterling } from 'lucide-react'

const WelcomeSection = () => {
  return (
    <section className="bg-background px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Welcome to QuickMart, Earlham Street
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 mb-3">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Star className="h-6 w-6 text-primary fill-primary" />
            <div>
              <span className="text-lg font-bold text-primary">4.8</span>
              <span className="text-lg text-primary ml-2">Excellent</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <span className="text-lg text-foreground">Deliver in</span>
              <span className="text-lg font-semibold text-primary ml-2">
                15-30 minutes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ReceiptPoundSterling className="h-6 w-6 text-primary" />
            <div>
              <span className="text-lg text-foreground">Minimum order</span>
              <span className="text-lg font-semibold text-primary ml-2">
                £15
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection

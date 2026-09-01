import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/** "Enter your loyalty information" banner shown at the top of the basket. */
const LoyaltyBanner = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [linked, setLinked] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim()) return;
    setLinked(true);
    toast({
      title: 'Loyalty card linked',
      description: 'Your points will be added to this order.',
    });
  };

  if (linked) {
    return (
      <Card className="mb-8 border-2 border-success/40 bg-success/5">
        <CardContent className="p-5 flex items-center gap-3">
          <BadgeCheck className="w-6 h-6 text-success flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Loyalty card linked</p>
            <p className="text-sm text-muted-foreground">
              Card ending {cardNumber.trim().slice(-4)} — points will be added to this order.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-2 border-storefront/20 bg-storefront/[0.04]">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:items-end gap-4"
        >
          <div className="flex items-start gap-3 flex-1">
            <span className="w-10 h-10 rounded-full bg-storefront text-storefront-foreground flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <Label htmlFor="loyalty" className="font-display text-lg font-bold text-foreground">
                Enter your loyalty information
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5 mb-2">
                Collect points on this order and unlock member-only prices.
              </p>
              <Input
                id="loyalty"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Loyalty card number"
                inputMode="numeric"
                className="border-2 border-gray-300 max-w-sm"
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={!cardNumber.trim()}>
            Link card
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoyaltyBanner;

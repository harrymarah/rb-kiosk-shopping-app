import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket } from 'lucide-react';
import { useCoupons } from '@/contexts/CouponContext';
import { useToast } from '@/components/ui/use-toast';

/** Promo code entry for the Delivery Details section of checkout. */
const PromoCodeInput = () => {
  const { applyCouponByCode } = useCoupons();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const applied = applyCouponByCode(code);
    if (!applied) {
      setError("That promo code wasn't recognised.");
      return;
    }

    setError('');
    setCode('');
    toast({
      title: `Promo code applied — ${applied.value}`,
      description: `${applied.description} ${applied.productName}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Promo Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            placeholder="Enter promo code"
            aria-label="Promo code"
            className="border-2 border-gray-300 uppercase"
          />
          <Button type="submit" disabled={!code.trim()}>
            Apply
          </Button>
        </form>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default PromoCodeInput;

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import aslChartImage from '@assets/image_1761903320696.png';

interface ASLReferenceProps {
  onClose?: () => void;
}

export default function ASLReference({ onClose }: ASLReferenceProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-card-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold">ASL Alphabet Reference</h3>
          <p className="text-sm text-muted-foreground">American Sign Language A-Z</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-reference"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <img 
          src={aslChartImage} 
          alt="ASL Alphabet Chart showing hand signs for letters A through Z"
          className="w-full h-auto rounded-md"
          data-testid="img-asl-chart"
        />
      </div>
    </Card>
  );
}

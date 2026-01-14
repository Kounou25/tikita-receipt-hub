import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const GRStep2Summary = ({ subtotal, tvaAmount, total, receiptInfo, loading, isDownloading, navigate, handleGenerateReceipt }: any) => {
  return (
    <Card className="shadow-2xl bg-white sticky top-24">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Résumé du reçu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-bold">{subtotal.toLocaleString()} FCFA</span>
          </div>
          {receiptInfo.tva_rate > 0 && (
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">TVA ({receiptInfo.tva_rate}%)</span>
              <span className="font-bold">+{tvaAmount.toLocaleString()} FCFA</span>
            </div>
          )}
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-2xl font-black text-gray-900">Total</span>
              <span className="text-3xl font-black text-gray-900">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 rounded-2xl border-2 text-lg"
            onClick={() => navigate('/generate')}
            disabled={loading || isDownloading}
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Retour
          </Button>
          <Button
            size="lg"
            className="w-full h-16 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-4"
            onClick={handleGenerateReceipt}
            disabled={
              loading ||
              isDownloading ||
              !((receiptInfo && receiptInfo.tva_rate) !== undefined) /* keep original gating in page */
            }
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                Générer le reçu
                <ArrowRight className="w-7 h-7" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GRStep2Summary;

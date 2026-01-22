import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const GRStep2ItemsList = ({ items, addItem, removeItem, updateItem, loading }: any) => {
  const { t } = useTranslation();
  
  return (
    <Card className="shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700">
      <CardHeader className="flex items-center justify-between pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{t('generateReceipt.articles')}</CardTitle>
        <Button
          onClick={addItem}
          className="h-12 px-6 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl shadow-md"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('generateReceipt.addArticle')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item: any) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('generateReceipt.descriptionRequired')}</Label>
              <Input
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder={t('generateReceipt.itemDescription')}
                className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('generateReceipt.quantityLabel')}</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-3">
              <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('generateReceipt.unitPrice')}</Label>
              <Input
                type="number"
                min="0"
                value={item.unit_price || ''}
                onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)}
                placeholder={t('generateReceipt.quantity')}
                className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-1 flex justify-end">
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-12 w-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  disabled={loading}
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GRStep2ItemsList;

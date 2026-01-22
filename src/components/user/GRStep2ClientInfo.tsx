import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GRStep2ClientInfo = ({ clients, loading, clientInfo, setClientInfo, handleClientSelect }: any) => {
  const { t } = useTranslation();
  
  return (
    <Card className="shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{t('generateReceipt.clientInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('generateReceipt.selectExistingClient')}</Label>
          <Select onValueChange={handleClientSelect} disabled={loading}>
            <SelectTrigger className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <SelectValue placeholder={t('generateReceipt.selectOrEnterManually')} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client: any) => (
                <SelectItem key={client.client_id} value={client.client_id.toString()}>
                  {client.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('generateReceipt.fullNameRequired')}</Label>
            <Input
              value={clientInfo.full_name}
              onChange={(e) => setClientInfo({ ...clientInfo, full_name: e.target.value })}
              placeholder={t('generateReceipt.clientName')}
              className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('auth.email')}</Label>
            <Input
              type="email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
              placeholder={t('generateReceipt.clientEmail')}
              className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('auth.phone')}</Label>
            <Input
              value={clientInfo.phone_number}
              onChange={(e) => setClientInfo({ ...clientInfo, phone_number: e.target.value })}
              placeholder={t('generateReceipt.clientPhone')}
              className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">{t('auth.address')}</Label>
            <Input
              value={clientInfo.address}
              onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
              placeholder={t('generateReceipt.clientAddress')}
              className="h-14 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GRStep2ClientInfo;

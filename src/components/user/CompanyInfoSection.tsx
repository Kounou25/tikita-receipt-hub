import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CompanyInfoSection = ({ displayedProfile, isEditing, setProfileState }: any) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
        <Building2 className="w-8 h-8" />
        {t('profile.companyInfo')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="dark:text-gray-200">{t('auth.companyName')}</Label>
          <Input
            id="companyName"
            value={displayedProfile.companyName || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, companyName: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slogan" className="dark:text-gray-200">{t('auth.slogan')}</Label>
          <Input
            id="slogan"
            value={displayedProfile.slogan || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, slogan: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="dark:text-gray-200">{t('auth.address')}</Label>
          <Textarea
            id="address"
            value={displayedProfile.address || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, address: e.target.value }))}
            disabled={!isEditing}
            className="text-base rounded-xl border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nif" className="dark:text-gray-200">{t('auth.nif')}</Label>
          <Input
            id="nif"
            value={displayedProfile.nif || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, nif: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rccm" className="dark:text-gray-200">{t('auth.rccm')}</Label>
          <Input
            id="rccm"
            value={displayedProfile.rccm || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, rccm: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;

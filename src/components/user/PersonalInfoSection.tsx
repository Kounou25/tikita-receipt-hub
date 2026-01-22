import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PersonalInfoSection = ({ displayedProfile, isEditing, setProfileState }: any) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
        <User className="w-8 h-8" />
        {t('profile.personalInfo')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-900 dark:text-gray-200">{t('auth.fullName')}</Label>
          <Input
            id="fullName"
            value={displayedProfile.fullName || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, fullName: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900 dark:text-gray-200">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            value={displayedProfile.email || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, email: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900 dark:text-gray-200">{t('auth.phone')}</Label>
          <Input
            id="phone"
            value={displayedProfile.phone || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, phone: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-900 dark:text-gray-200">{t('auth.country')}</Label>
          <Input
            id="country"
            value={displayedProfile.country || ''}
            disabled
            className="h-12 text-base rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;

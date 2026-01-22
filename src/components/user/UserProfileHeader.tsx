import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Upload, Loader2, Save } from 'lucide-react';

const UserProfileHeader = ({ displayedProfile, isEditing, setIsEditing, saveMutation, handleSave }: any) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-md transition-shadow mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            {displayedProfile.avatar ? (
              <img
                src={displayedProfile.avatar}
                alt={displayedProfile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-4xl font-bold">
                {displayedProfile.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 dark:bg-white/40 rounded-full flex items-center justify-center">
                <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900 text-xs px-2 py-1">
                  <Upload className="w-3 h-3 mr-1" />
                  {t('common.edit')}
                </Button>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-black dark:text-white">{displayedProfile.fullName}</h2>
              <BadgeCheck className="w-6 h-6 text-black dark:text-white" />
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300">{displayedProfile.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {displayedProfile.userNumber}</p>
          </div>
        </div>
        {/* Bouton édition géré par la page */}
        {false && (
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={"shadow-md hover:shadow-lg transition-all duration-200"}
            disabled={saveMutation?.isLoading}
          >
            {saveMutation?.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            ) : (
              'Modifier mon profil'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;

import React from 'react';
import { Palette, Building2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PersonalizationSection = ({ displayedProfile, isEditing, setProfileState }: any) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
        <Palette className="w-8 h-8" />
        Personnalisation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <Label htmlFor="brandColor" className="dark:text-gray-200">Couleur de marque</Label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              id="brandColor"
              value={displayedProfile.brandColor || '#000000'}
              onChange={(e) => setProfileState((p: any) => ({ ...p, brandColor: e.target.value }))}
              disabled={!isEditing}
              className="w-16 h-16 rounded-xl border-4 border-gray-300 dark:border-gray-700 cursor-pointer"
            />
            <Input
              value={displayedProfile.brandColor || ''}
              disabled
              className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="dark:text-gray-200">Logo de l'entreprise</Label>
          <div className="flex items-center gap-4">
            {displayedProfile.avatar ? (
              <img
                src={displayedProfile.avatar}
                alt="Logo entreprise"
                className="w-24 h-24 rounded-xl object-contain border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {isEditing && (
              <Button variant="outline" className="h-12 px-6 rounded-xl shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
                <Upload className="w-5 h-5 mr-2" />
                Changer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationSection;

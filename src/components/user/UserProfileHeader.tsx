import React from 'react';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Upload, Loader2, Save } from 'lucide-react';

const UserProfileHeader = ({ displayedProfile, isEditing, setIsEditing, saveMutation, handleSave }: any) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            {displayedProfile.avatar ? (
              <img
                src={displayedProfile.avatar}
                alt={displayedProfile.fullName}
                className="w-32 h-32 rounded-xl object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-black text-white rounded-xl flex items-center justify-center text-5xl font-bold">
                {displayedProfile.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-gray-100">
                  <Upload className="w-5 h-5 mr-2" />
                  Modifier
                </Button>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold text-black">{displayedProfile.fullName}</h2>
              <BadgeCheck className="w-9 h-9 text-black" />
            </div>
            <p className="text-2xl text-gray-700">{displayedProfile.email}</p>
            <p className="text-base text-gray-500 mt-1">ID: {displayedProfile.userNumber}</p>
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

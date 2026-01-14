import React from 'react';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PersonalInfoSection = ({ displayedProfile, isEditing, setProfileState }: any) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
        <User className="w-8 h-8" />
        Informations personnelles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <Input
            id="fullName"
            value={displayedProfile.fullName || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, fullName: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={displayedProfile.email || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, email: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={displayedProfile.phone || ''}
            onChange={(e) => setProfileState((p: any) => ({ ...p, phone: e.target.value }))}
            disabled={!isEditing}
            className="h-12 text-base rounded-xl border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            value={displayedProfile.country || ''}
            disabled
            className="h-12 text-base rounded-xl border-gray-300 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;

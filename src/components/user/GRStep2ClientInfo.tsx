import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GRStep2ClientInfo = ({ clients, loading, clientInfo, setClientInfo, handleClientSelect }: any) => {
  return (
    <Card className="shadow-lg bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Informations client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3">Sélectionner un client existant</Label>
          <Select onValueChange={handleClientSelect} disabled={loading}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue placeholder="Choisir un client ou saisir manuellement" />
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
            <Label className="text-base font-medium text-gray-700 mb-3">Nom complet *</Label>
            <Input
              value={clientInfo.full_name}
              onChange={(e) => setClientInfo({ ...clientInfo, full_name: e.target.value })}
              placeholder="Nom du client"
              className="h-14 text-base"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3">Email</Label>
            <Input
              type="email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
              placeholder="email@exemple.com"
              className="h-14 text-base"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3">Téléphone</Label>
            <Input
              value={clientInfo.phone_number}
              onChange={(e) => setClientInfo({ ...clientInfo, phone_number: e.target.value })}
              placeholder="+227 XX XX XX XX"
              className="h-14 text-base"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3">Adresse</Label>
            <Input
              value={clientInfo.address}
              onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
              placeholder="Adresse complète"
              className="h-14 text-base"
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GRStep2ClientInfo;

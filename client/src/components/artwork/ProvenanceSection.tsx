import React from 'react';
import { User, Calendar, DollarSign, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProvenanceEntry {
  id: string;
  ownerId: string;
  ownerName: string;
  fromDate: string;
  toDate: string | null;
  acquisitionPrice: number;
  certificateUrl?: string;
  verified: boolean;
}

interface ProvenanceSectionProps {
  entries: ProvenanceEntry[];
  currentOwnerId: string;
  certificateOfAuthenticity?: {
    issuedBy: string;
    issuedDate: string;
    certificateNumber: string;
    url?: string;
  };
}

export default function ProvenanceSection({ 
  entries, 
  currentOwnerId,
  certificateOfAuthenticity 
}: ProvenanceSectionProps) {
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="space-y-6">
      {/* Certificate of Authenticity */}
      {certificateOfAuthenticity && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-green-600" />
              <CardTitle className="text-green-900">Цифровой Сертификат Подлинности</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700 mb-1">Выдан</p>
                <p className="font-semibold text-green-900">{certificateOfAuthenticity.issuedBy}</p>
              </div>
              <div>
                <p className="text-sm text-green-700 mb-1">Дата выдачи</p>
                <p className="font-semibold text-green-900">{certificateOfAuthenticity.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm text-green-700 mb-1">Номер сертификата</p>
                <p className="font-mono font-semibold text-green-900">{certificateOfAuthenticity.certificateNumber}</p>
              </div>
              {certificateOfAuthenticity.url && (
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-600 text-green-600 hover:bg-green-100"
                    onClick={() => window.open(certificateOfAuthenticity.url, '_blank')}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Просмотреть сертификат
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provenance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>История Владения (Provenance)</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Полная прозрачная история переходов права собственности
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Entries */}
            <div className="space-y-6">
              {sortedEntries.map((entry, index) => {
                const isCurrent = entry.ownerId === currentOwnerId;
                const isFirst = index === 0;

                return (
                  <div key={entry.id} className="relative pl-14">
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 top-0 w-5 h-5 rounded-full border-4 ${
                      isCurrent ? 'bg-blue-600 border-blue-200' :
                      entry.verified ? 'bg-green-600 border-green-200' :
                      'bg-gray-400 border-gray-200'
                    }`}></div>

                    {/* Entry Card */}
                    <div className={`p-4 rounded-lg border-2 transition ${
                      isCurrent ? 'bg-blue-50 border-blue-300' :
                      'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <User size={18} className={isCurrent ? 'text-blue-600' : 'text-gray-600'} />
                          <h4 className="font-semibold text-gray-900">{entry.ownerName}</h4>
                          {isCurrent && (
                            <Badge className="bg-blue-600">Текущий владелец</Badge>
                          )}
                          {entry.verified && !isCurrent && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle size={12} className="mr-1" />
                              Верифицировано
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>
                            {entry.fromDate} {entry.toDate ? `— ${entry.toDate}` : '— настоящее время'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign size={16} />
                          <span className="font-semibold">
                            Приобретено за {formatPrice(entry.acquisitionPrice)} ₽
                          </span>
                        </div>
                      </div>

                      {entry.certificateUrl && (
                        <div className="mt-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(entry.certificateUrl, '_blank')}
                          >
                            Просмотреть документы →
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
                <p className="text-sm text-gray-600">Владельцев</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {entries.filter(e => e.verified).length}
                </p>
                <p className="text-sm text-gray-600">Верифицировано</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {new Date().getFullYear() - new Date(entries[entries.length - 1]?.fromDate).getFullYear()}
                </p>
                <p className="text-sm text-gray-600">Лет в обороте</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Info (Optional) */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-purple-900">Защищено Blockchain</p>
              <p className="text-sm text-purple-700">История владения записана в распределенном реестре</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="border-purple-600 text-purple-600 hover:bg-purple-100"
            >
              Подробнее
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

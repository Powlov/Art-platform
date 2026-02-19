import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Eye,
  Edit,
  Trash2,
  Clock,
  Check,
  X,
  AlertTriangle,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface AccessPermission {
  id: number;
  consultantId: number;
  consultantName: string;
  consultantEmail: string;
  grantedAt: string;
  expiresAt?: string;
  status: 'active' | 'pending' | 'expired' | 'revoked';
  permissions: {
    viewCollection: boolean;
    viewFinancials: boolean;
    viewAnalytics: boolean;
    makeRecommendations: boolean;
    manageArtworks: boolean;
  };
  lastAccessed?: string;
}

interface AccessControlPanelProps {
  userRole: 'collector' | 'consultant';
}

const AccessControlPanel: React.FC<AccessControlPanelProps> = ({ userRole }) => {
  const [permissions, setPermissions] = useState<AccessPermission[]>([
    {
      id: 1,
      consultantId: 101,
      consultantName: 'Мария Иванова',
      consultantEmail: 'maria@artconsult.ru',
      grantedAt: '2024-11-01',
      expiresAt: '2025-11-01',
      status: 'active',
      permissions: {
        viewCollection: true,
        viewFinancials: true,
        viewAnalytics: true,
        makeRecommendations: true,
        manageArtworks: false,
      },
      lastAccessed: '2024-12-20',
    },
    {
      id: 2,
      consultantId: 102,
      consultantName: 'Дмитрий Соколов',
      consultantEmail: 'dmitry@artexpert.com',
      grantedAt: '2024-10-15',
      status: 'pending',
      permissions: {
        viewCollection: true,
        viewFinancials: false,
        viewAnalytics: true,
        makeRecommendations: true,
        manageArtworks: false,
      },
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<AccessPermission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New permission form state
  const [newPermission, setNewPermission] = useState({
    consultantEmail: '',
    expirationMonths: '12',
    permissions: {
      viewCollection: true,
      viewFinancials: false,
      viewAnalytics: true,
      makeRecommendations: true,
      manageArtworks: false,
    },
  });

  const handleGrantAccess = () => {
    // Validate email
    if (!newPermission.consultantEmail || !newPermission.consultantEmail.includes('@')) {
      toast.error('Введите корректный email консультанта');
      return;
    }

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + parseInt(newPermission.expirationMonths));

    const newPerm: AccessPermission = {
      id: permissions.length + 1,
      consultantId: Math.floor(Math.random() * 1000) + 100,
      consultantName: 'Новый консультант',
      consultantEmail: newPermission.consultantEmail,
      grantedAt: new Date().toISOString().split('T')[0],
      expiresAt: expirationDate.toISOString().split('T')[0],
      status: 'pending',
      permissions: newPermission.permissions,
    };

    setPermissions([...permissions, newPerm]);
    toast.success('Приглашение отправлено консультанту');
    setShowAddDialog(false);

    // Reset form
    setNewPermission({
      consultantEmail: '',
      expirationMonths: '12',
      permissions: {
        viewCollection: true,
        viewFinancials: false,
        viewAnalytics: true,
        makeRecommendations: true,
        manageArtworks: false,
      },
    });
  };

  const handleRevokeAccess = (permissionId: number) => {
    setPermissions(
      permissions.map((p) =>
        p.id === permissionId
          ? {
              ...p,
              status: 'revoked' as const,
            }
          : p,
      ),
    );
    toast.success('Доступ успешно отозван');
  };

  const handleUpdatePermissions = () => {
    if (!selectedPermission) return;

    setPermissions(
      permissions.map((p) => (p.id === selectedPermission.id ? selectedPermission : p)),
    );
    toast.success('Права доступа обновлены');
    setShowEditDialog(false);
    setSelectedPermission(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Активен', className: 'bg-green-500' },
      pending: { label: 'Ожидает', className: 'bg-yellow-500' },
      expired: { label: 'Истёк', className: 'bg-gray-500' },
      revoked: { label: 'Отозван', className: 'bg-red-500' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.className} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const filteredPermissions = permissions.filter((p) => {
    const matchesSearch =
      p.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.consultantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activePermissionsCount = permissions.filter((p) => p.status === 'active').length;
  const pendingPermissionsCount = permissions.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Активные консультанты</p>
                <p className="text-3xl font-bold">{activePermissionsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ожидают подтверждения</p>
                <p className="text-3xl font-bold">{pendingPermissionsCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Всего доступов</p>
                <p className="text-3xl font-bold">{permissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Управление доступом консультантов
            </CardTitle>
            {userRole === 'collector' && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Пригласить консультанта
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Пригласить консультанта</DialogTitle>
                    <DialogDescription>
                      Предоставьте консультанту доступ к вашей коллекции
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email консультанта *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="consultant@example.com"
                        value={newPermission.consultantEmail}
                        onChange={(e) =>
                          setNewPermission({ ...newPermission, consultantEmail: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiration">Срок действия</Label>
                      <Select
                        value={newPermission.expirationMonths}
                        onValueChange={(value) =>
                          setNewPermission({ ...newPermission, expirationMonths: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 месяца</SelectItem>
                          <SelectItem value="6">6 месяцев</SelectItem>
                          <SelectItem value="12">1 год</SelectItem>
                          <SelectItem value="24">2 года</SelectItem>
                          <SelectItem value="0">Без ограничений</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Права доступа</Label>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="viewCollection">Просмотр коллекции</Label>
                          <p className="text-sm text-gray-500">
                            Доступ к списку произведений в коллекции
                          </p>
                        </div>
                        <Switch
                          id="viewCollection"
                          checked={newPermission.permissions.viewCollection}
                          onCheckedChange={(checked) =>
                            setNewPermission({
                              ...newPermission,
                              permissions: {
                                ...newPermission.permissions,
                                viewCollection: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="viewFinancials">Просмотр финансов</Label>
                          <p className="text-sm text-gray-500">
                            Доступ к ценам, оценкам и инвестиционным данным
                          </p>
                        </div>
                        <Switch
                          id="viewFinancials"
                          checked={newPermission.permissions.viewFinancials}
                          onCheckedChange={(checked) =>
                            setNewPermission({
                              ...newPermission,
                              permissions: {
                                ...newPermission.permissions,
                                viewFinancials: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="viewAnalytics">Просмотр аналитики</Label>
                          <p className="text-sm text-gray-500">
                            Доступ к рыночной аналитике и трендам
                          </p>
                        </div>
                        <Switch
                          id="viewAnalytics"
                          checked={newPermission.permissions.viewAnalytics}
                          onCheckedChange={(checked) =>
                            setNewPermission({
                              ...newPermission,
                              permissions: {
                                ...newPermission.permissions,
                                viewAnalytics: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="makeRecommendations">Создание рекомендаций</Label>
                          <p className="text-sm text-gray-500">
                            Возможность создавать персональные рекомендации
                          </p>
                        </div>
                        <Switch
                          id="makeRecommendations"
                          checked={newPermission.permissions.makeRecommendations}
                          onCheckedChange={(checked) =>
                            setNewPermission({
                              ...newPermission,
                              permissions: {
                                ...newPermission.permissions,
                                makeRecommendations: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="manageArtworks">Управление произведениями</Label>
                          <p className="text-sm text-gray-500">
                            Редактирование и добавление произведений
                          </p>
                        </div>
                        <Switch
                          id="manageArtworks"
                          checked={newPermission.permissions.manageArtworks}
                          onCheckedChange={(checked) =>
                            setNewPermission({
                              ...newPermission,
                              permissions: {
                                ...newPermission.permissions,
                                manageArtworks: checked,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                            Важная информация
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Консультант получит email-приглашение. Доступ будет активирован после
                            подтверждения. Вы можете отозвать доступ в любое время.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleGrantAccess}>Отправить приглашение</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="pending">Ожидают</SelectItem>
                <SelectItem value="expired">Истёкшие</SelectItem>
                <SelectItem value="revoked">Отозванные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            {filteredPermissions.map((permission, index) => (
              <motion.div
                key={permission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {permission.consultantName}
                        </h4>
                        {getStatusBadge(permission.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {permission.consultantEmail}
                      </p>

                      {/* Permissions badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {permission.permissions.viewCollection && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Коллекция
                          </Badge>
                        )}
                        {permission.permissions.viewFinancials && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Финансы
                          </Badge>
                        )}
                        {permission.permissions.viewAnalytics && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Аналитика
                          </Badge>
                        )}
                        {permission.permissions.makeRecommendations && (
                          <Badge variant="outline" className="text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Рекомендации
                          </Badge>
                        )}
                        {permission.permissions.manageArtworks && (
                          <Badge variant="outline" className="text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Управление
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>
                          Предоставлен:{' '}
                          {new Date(permission.grantedAt).toLocaleDateString('ru-RU')}
                        </span>
                        {permission.expiresAt && (
                          <span>
                            Истекает:{' '}
                            {new Date(permission.expiresAt).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                        {permission.lastAccessed && (
                          <span>
                            Последний вход:{' '}
                            {new Date(permission.lastAccessed).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {userRole === 'collector' && (
                    <div className="flex gap-2">
                      {permission.status === 'active' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPermission(permission);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRevokeAccess(permission.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {filteredPermissions.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Консультанты не найдены</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить права доступа</DialogTitle>
            <DialogDescription>
              Обновите права доступа для {selectedPermission?.consultantName}
            </DialogDescription>
          </DialogHeader>

          {selectedPermission && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Просмотр коллекции</Label>
                </div>
                <Switch
                  checked={selectedPermission.permissions.viewCollection}
                  onCheckedChange={(checked) =>
                    setSelectedPermission({
                      ...selectedPermission,
                      permissions: {
                        ...selectedPermission.permissions,
                        viewCollection: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Просмотр финансов</Label>
                </div>
                <Switch
                  checked={selectedPermission.permissions.viewFinancials}
                  onCheckedChange={(checked) =>
                    setSelectedPermission({
                      ...selectedPermission,
                      permissions: {
                        ...selectedPermission.permissions,
                        viewFinancials: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Просмотр аналитики</Label>
                </div>
                <Switch
                  checked={selectedPermission.permissions.viewAnalytics}
                  onCheckedChange={(checked) =>
                    setSelectedPermission({
                      ...selectedPermission,
                      permissions: {
                        ...selectedPermission.permissions,
                        viewAnalytics: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Создание рекомендаций</Label>
                </div>
                <Switch
                  checked={selectedPermission.permissions.makeRecommendations}
                  onCheckedChange={(checked) =>
                    setSelectedPermission({
                      ...selectedPermission,
                      permissions: {
                        ...selectedPermission.permissions,
                        makeRecommendations: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Управление произведениями</Label>
                </div>
                <Switch
                  checked={selectedPermission.permissions.manageArtworks}
                  onCheckedChange={(checked) =>
                    setSelectedPermission({
                      ...selectedPermission,
                      permissions: {
                        ...selectedPermission.permissions,
                        manageArtworks: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleUpdatePermissions}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessControlPanel;

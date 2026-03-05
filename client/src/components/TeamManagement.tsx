import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Key,
  Activity,
  Calendar,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'BANK_ADMIN' | 'BANK_MANAGER' | 'BANK_ANALYST' | 'BANK_API';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  permissions: string[];
}

const BANK_ROLES = {
  BANK_ADMIN: {
    name: 'Администратор',
    color: 'bg-red-100 text-red-700 border-red-200',
    description: 'Полный доступ ко всем функциям',
  },
  BANK_MANAGER: {
    name: 'Менеджер',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Управление займами и клиентами',
  },
  BANK_ANALYST: {
    name: 'Аналитик',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Анализ рисков и отчётность',
  },
  BANK_API: {
    name: 'API Интеграция',
    color: 'bg-green-100 text-green-700 border-green-200',
    description: 'Системная интеграция',
  },
};

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Иван Петров',
      email: 'i.petrov@sberbank.ru',
      role: 'BANK_ADMIN',
      status: 'active',
      lastActive: '5 мин назад',
      createdAt: '2024-01-15',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      email: 'm.sidorova@sberbank.ru',
      role: 'BANK_MANAGER',
      status: 'active',
      lastActive: '1 час назад',
      createdAt: '2024-02-10',
      permissions: ['loans.view', 'loans.create', 'loans.approve'],
    },
    {
      id: '3',
      name: 'Алексей Кузнецов',
      email: 'a.kuznetsov@sberbank.ru',
      role: 'BANK_ANALYST',
      status: 'active',
      lastActive: '2 часа назад',
      createdAt: '2024-02-20',
      permissions: ['risk.view', 'reports.view', 'analytics.view'],
    },
    {
      id: '4',
      name: 'Ольга Новикова',
      email: 'o.novikova@sberbank.ru',
      role: 'BANK_MANAGER',
      status: 'inactive',
      lastActive: '3 дня назад',
      createdAt: '2024-01-20',
      permissions: ['loans.view', 'loans.create'],
    },
    {
      id: '5',
      name: 'API Service Account',
      email: 'api@sberbank.ru',
      role: 'BANK_API',
      status: 'active',
      lastActive: '2 мин назад',
      createdAt: '2024-01-10',
      permissions: ['api.access', 'webhooks.manage'],
    },
  ];

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    admins: teamMembers.filter(m => m.role === 'BANK_ADMIN').length,
    managers: teamMembers.filter(m => m.role === 'BANK_MANAGER').length,
  };

  const recentActivity = [
    { user: 'Иван Петров', action: 'Создал нового пользователя', time: '10 мин назад', icon: UserPlus },
    { user: 'Мария Сидорова', action: 'Обновила роль пользователя', time: '1 час назад', icon: Edit },
    { user: 'Алексей Кузнецов', action: 'Просмотрел отчёт по рискам', time: '2 часа назад', icon: Activity },
    { user: 'Иван Петров', action: 'Изменил настройки API', time: '5 часов назад', icon: Key },
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddMember = () => {
    toast.success('Новый пользователь добавлен');
    setIsAddDialogOpen(false);
  };

  const handleEditMember = () => {
    toast.success('Пользователь обновлён');
    setIsEditDialogOpen(false);
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (confirm(`Удалить пользователя ${member.name}?`)) {
      toast.success('Пользователь удалён');
    }
  };

  const handleToggleStatus = (member: TeamMember) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    toast.success(`Статус изменён на ${newStatus === 'active' ? 'активен' : 'неактивен'}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-500">Всего пользователей</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-gray-500">Активных</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.admins}</div>
                <div className="text-sm text-gray-500">Администраторов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.managers}</div>
                <div className="text-sm text-gray-500">Менеджеров</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Команда банка</CardTitle>
                <CardDescription>Управление пользователями и ролями</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Добавить пользователя
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Новый пользователь</DialogTitle>
                    <DialogDescription>Добавьте нового члена команды</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Имя</Label>
                      <Input placeholder="Иван Иванов" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="i.ivanov@sberbank.ru" />
                    </div>
                    <div className="space-y-2">
                      <Label>Роль</Label>
                      <Select defaultValue="BANK_MANAGER">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(BANK_ROLES).map(([key, role]) => (
                            <SelectItem key={key} value={key}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddMember} className="w-full">Создать</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  {Object.entries(BANK_ROLES).map(([key, role]) => (
                    <SelectItem key={key} value={key}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members List */}
            <div className="space-y-2">
              <AnimatePresence>
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{member.name}</span>
                            <Badge 
                              variant="outline" 
                              className={BANK_ROLES[member.role].color}
                            >
                              {BANK_ROLES[member.role].name}
                            </Badge>
                            {member.status === 'active' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Активен
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Неактивен
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {member.lastActive}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(member)}
                        >
                          {member.status === 'active' ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Пользователи не найдены</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Последняя активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <activity.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

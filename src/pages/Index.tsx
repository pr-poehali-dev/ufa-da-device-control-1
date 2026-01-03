import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Device {
  id: string;
  name: string;
  type: 'tv' | 'other';
  status: 'online' | 'offline';
  power: boolean;
  volume?: number;
  channel?: number;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  access: 'full' | 'limited' | 'view';
  status: 'active' | 'inactive';
}

interface Contract {
  id: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

interface ActivityLog {
  id: string;
  action: string;
  deviceName: string;
  timestamp: string;
  user: string;
}

export default function Index() {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Samsung TV Гостиная', type: 'tv', status: 'online', power: true, volume: 35, channel: 5 },
    { id: '2', name: 'LG TV Спальня', type: 'tv', status: 'online', power: false, volume: 20, channel: 1 },
    { id: '3', name: 'Sony TV Кухня', type: 'tv', status: 'offline', power: false, volume: 15, channel: 3 },
  ]);

  const [tenants, setTenants] = useState<Tenant[]>([
    { id: '1', name: 'Иванов Иван', email: 'ivanov@mail.ru', access: 'full', status: 'active' },
    { id: '2', name: 'Петрова Мария', email: 'petrova@mail.ru', access: 'limited', status: 'active' },
    { id: '3', name: 'Сидоров Петр', email: 'sidorov@mail.ru', access: 'view', status: 'inactive' },
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    { id: '1', tenantId: '1', tenantName: 'Иванов Иван', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
    { id: '2', tenantId: '2', tenantName: 'Петрова Мария', startDate: '2024-03-15', endDate: '2025-03-14', status: 'active' },
    { id: '3', tenantId: '3', tenantName: 'Сидоров Петр', startDate: '2023-06-01', endDate: '2024-05-31', status: 'expired' },
  ]);

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    { id: '1', action: 'Включен телевизор', deviceName: 'Samsung TV Гостиная', timestamp: '2024-01-03 14:23', user: 'Администратор' },
    { id: '2', action: 'Изменена громкость (35)', deviceName: 'Samsung TV Гостиная', timestamp: '2024-01-03 14:25', user: 'Администратор' },
    { id: '3', action: 'Выключен телевизор', deviceName: 'LG TV Спальня', timestamp: '2024-01-03 13:15', user: 'Иванов Иван' },
  ]);

  const [newDevice, setNewDevice] = useState({ name: '', type: 'tv' as const });
  const [newTenant, setNewTenant] = useState({ name: '', email: '', access: 'limited' as const });
  const [newContract, setNewContract] = useState({ tenantId: '', startDate: '', endDate: '' });

  const toggleDevicePower = (deviceId: string) => {
    setDevices(devices.map(d => {
      if (d.id === deviceId) {
        const newPower = !d.power;
        setActivityLog([{
          id: Date.now().toString(),
          action: newPower ? 'Включен телевизор' : 'Выключен телевизор',
          deviceName: d.name,
          timestamp: new Date().toLocaleString('ru-RU'),
          user: 'Администратор'
        }, ...activityLog]);
        return { ...d, power: newPower };
      }
      return d;
    }));
    toast.success('Команда отправлена');
  };

  const changeVolume = (deviceId: string, delta: number) => {
    setDevices(devices.map(d => {
      if (d.id === deviceId && d.volume !== undefined) {
        const newVolume = Math.max(0, Math.min(100, d.volume + delta));
        setActivityLog([{
          id: Date.now().toString(),
          action: `Изменена громкость (${newVolume})`,
          deviceName: d.name,
          timestamp: new Date().toLocaleString('ru-RU'),
          user: 'Администратор'
        }, ...activityLog]);
        return { ...d, volume: newVolume };
      }
      return d;
    }));
  };

  const changeChannel = (deviceId: string, delta: number) => {
    setDevices(devices.map(d => {
      if (d.id === deviceId && d.channel !== undefined) {
        const newChannel = Math.max(1, Math.min(999, d.channel + delta));
        setActivityLog([{
          id: Date.now().toString(),
          action: `Переключен канал (${newChannel})`,
          deviceName: d.name,
          timestamp: new Date().toLocaleString('ru-RU'),
          user: 'Администратор'
        }, ...activityLog]);
        return { ...d, channel: newChannel };
      }
      return d;
    }));
  };

  const addDevice = () => {
    if (!newDevice.name) {
      toast.error('Введите название устройства');
      return;
    }
    const device: Device = {
      id: Date.now().toString(),
      name: newDevice.name,
      type: newDevice.type,
      status: 'offline',
      power: false,
      volume: 20,
      channel: 1
    };
    setDevices([...devices, device]);
    setNewDevice({ name: '', type: 'tv' });
    toast.success('Устройство добавлено');
  };

  const removeDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    toast.success('Устройство удалено');
  };

  const addTenant = () => {
    if (!newTenant.name || !newTenant.email) {
      toast.error('Заполните все поля');
      return;
    }
    const tenant: Tenant = {
      id: Date.now().toString(),
      ...newTenant,
      status: 'active'
    };
    setTenants([...tenants, tenant]);
    setNewTenant({ name: '', email: '', access: 'limited' });
    toast.success('Жилец добавлен');
  };

  const addContract = () => {
    if (!newContract.tenantId || !newContract.startDate || !newContract.endDate) {
      toast.error('Заполните все поля');
      return;
    }
    const tenant = tenants.find(t => t.id === newContract.tenantId);
    if (!tenant) return;

    const contract: Contract = {
      id: Date.now().toString(),
      ...newContract,
      tenantName: tenant.name,
      status: 'active'
    };
    setContracts([...contracts, contract]);
    setNewContract({ tenantId: '', startDate: '', endDate: '' });
    toast.success('Договор создан');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
              <Icon name="Home" size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Уфа-ДА
              </h1>
              <p className="text-sm text-muted-foreground">Система управления домом</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="glass px-4 py-2">
              <Icon name="Activity" size={16} className="mr-2" />
              {devices.filter(d => d.status === 'online').length} онлайн
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass p-1.5">
            <TabsTrigger value="dashboard" className="data-[state=active]:gradient-primary">
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              Панель
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:gradient-primary">
              <Icon name="Tv" size={18} className="mr-2" />
              Устройства
            </TabsTrigger>
            <TabsTrigger value="tenants" className="data-[state=active]:gradient-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Жильцы
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:gradient-primary">
              <Icon name="FileText" size={18} className="mr-2" />
              Договоры
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:gradient-primary">
              <Icon name="Clock" size={18} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(device => (
                <Card key={device.id} className="glass p-6 hover-scale">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${device.status === 'online' ? 'bg-accent/20' : 'bg-muted/20'}`}>
                        <Icon name="Tv" size={24} className={device.status === 'online' ? 'text-accent' : 'text-muted-foreground'} />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold">{device.name}</h3>
                        <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="mt-1">
                          {device.status === 'online' ? 'Онлайн' : 'Офлайн'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {device.status === 'online' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Питание</span>
                        <Switch
                          checked={device.power}
                          onCheckedChange={() => toggleDevicePower(device.id)}
                        />
                      </div>

                      {device.power && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Громкость</span>
                              <span className="text-sm font-semibold">{device.volume}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => changeVolume(device.id, -5)}>
                                <Icon name="VolumeX" size={16} />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => changeVolume(device.id, 5)}>
                                <Icon name="Volume2" size={16} />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Канал</span>
                              <span className="text-sm font-semibold">{device.channel}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => changeChannel(device.id, -1)}>
                                <Icon name="ChevronDown" size={16} />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => changeChannel(device.id, 1)}>
                                <Icon name="ChevronUp" size={16} />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6 animate-fade-in">
            <Card className="glass p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Добавить устройство</h2>
              <div className="flex gap-4">
                <Input
                  placeholder="Название устройства"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="glass"
                />
                <Button onClick={addDevice} className="gradient-primary">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {devices.map(device => (
                <Card key={device.id} className="glass p-6 hover-scale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${device.status === 'online' ? 'bg-accent/20' : 'bg-muted/20'}`}>
                        <Icon name="Tv" size={24} className={device.status === 'online' ? 'text-accent' : 'text-muted-foreground'} />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">{device.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                            {device.status === 'online' ? 'Онлайн' : 'Офлайн'}
                          </Badge>
                          <Badge variant={device.power ? 'default' : 'outline'}>
                            {device.power ? 'Включен' : 'Выключен'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDevice(device.id)}
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6 animate-fade-in">
            <Card className="glass p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Добавить жильца</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="ФИО"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="glass"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  className="glass"
                />
                <Button onClick={addTenant} className="gradient-primary">
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants.map(tenant => (
                <Card key={tenant.id} className="glass p-6 hover-scale">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white font-bold">
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-muted-foreground">{tenant.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                      {tenant.status === 'active' ? 'Активен' : 'Неактивен'}
                    </Badge>
                    <Badge variant="outline">
                      {tenant.access === 'full' ? 'Полный доступ' : tenant.access === 'limited' ? 'Ограниченный' : 'Просмотр'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6 animate-fade-in">
            <Card className="glass p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Создать договор</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={newContract.tenantId}
                  onChange={(e) => setNewContract({ ...newContract, tenantId: e.target.value })}
                  className="glass rounded-md px-3 py-2 text-sm bg-card border border-input"
                >
                  <option value="">Выберите жильца</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <Input
                  type="date"
                  value={newContract.startDate}
                  onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                  className="glass"
                />
                <Input
                  type="date"
                  value={newContract.endDate}
                  onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                  className="glass"
                />
                <Button onClick={addContract} className="gradient-primary">
                  <Icon name="FilePlus" size={18} className="mr-2" />
                  Создать
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {contracts.map(contract => (
                <Card key={contract.id} className="glass p-6 hover-scale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Icon name="FileText" size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">{contract.tenantName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contract.startDate} — {contract.endDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant={contract.status === 'active' ? 'default' : contract.status === 'expired' ? 'destructive' : 'secondary'}>
                      {contract.status === 'active' ? 'Активен' : contract.status === 'expired' ? 'Истёк' : 'Ожидание'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4 animate-fade-in">
            <Card className="glass p-6">
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                <Icon name="Clock" size={24} />
                История действий
              </h2>
              <div className="space-y-3">
                {activityLog.map(log => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover-scale">
                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                      <Icon name="Zap" size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.deviceName}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{log.timestamp}</p>
                      <p className="text-xs">{log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

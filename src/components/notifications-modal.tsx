'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAlerts,
  markAlertAsRead,
  markAlertAsDismissed,
} from '@/services/Alerts';
import { Check, X, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsModal({
  open,
  onOpenChange,
}: NotificationsModalProps) {
  const queryClient = useQueryClient();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: alertsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['alerts', 'all'],
    queryFn: () => getAlerts({ unread_only: false }),
    enabled: open,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (alertId: string) => markAlertAsRead({ alertId }),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
      toast.success('Alerta marcado como lido');
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const { mutate: dismissAlert } = useMutation({
    mutationFn: (alertId: string) => markAlertAsDismissed({ alertId }),
    onSuccess: (_, alertId) => {
      setDismissedAlerts((prev) => new Set(prev).add(alertId));
      refetch();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
      toast.success('Alerta descartado');
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const visibleAlerts = useMemo(() => {
    const alerts = alertsResponse?.data ?? [];

    const filteredAlerts = alerts.filter(
      (alert) => !alert.is_dismissed && !dismissedAlerts.has(alert.id),
    );

    const sortedAlerts = filteredAlerts.sort((left, right) => {
      return (
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime()
      );
    });

    return sortedAlerts.slice(0, 10);
  }, [alertsResponse, dismissedAlerts]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAlertTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      mudanca_status: 'Mudança de Status',
      publicacao: 'Publicação',
      prazo: 'Prazo',
      processo_similar: 'Processo Similar',
      renovacao_vencimento: 'Renovação de Vencimento',
    };
    return types[type] || type;
  };

  const getAlertTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      mudanca_status:
        'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
      publicacao:
        'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
      prazo: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
      processo_similar:
        'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
      renovacao_vencimento:
        'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
    };
    return colors[type] || 'text-gray-600 bg-gray-50 dark:bg-gray-950';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
          <DialogDescription>
            Gerencie seus alertas e notificações
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="mb-3 h-12 w-12" />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            visibleAlerts.map((alert) => {
              const message = alert.message
                .replace('BRAND', 'Marca')
                .replace('PATENT', 'Patente')
                .replace('DESIGN', 'Desenho Industrial')
                .replace('SOFTWARE', 'Programa de Computador');

              const messages = message.split('\n');

              const filteredMessages = messages.filter(
                (message) => !message.includes('Revista RPI'),
              );

              return (
                <div
                  key={alert.id}
                  className={`space-y-3 rounded-lg border p-4 transition-all ${
                    alert.is_read
                      ? 'bg-background'
                      : 'bg-muted border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{alert.title}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${getAlertTypeColor(alert.alert_type)}`}
                        >
                          {getAlertTypeLabel(alert.alert_type)}
                        </span>
                        {!alert.is_read && (
                          <span className="text-primary flex items-center gap-1 text-xs">
                            <span className="bg-primary h-2 w-2 animate-pulse rounded-full"></span>
                            Não lido
                          </span>
                        )}
                      </div>
                      {filteredMessages.map((message) => (
                        <p
                          key={message}
                          className="text-muted-foreground text-sm"
                        >
                          {message}
                        </p>
                      ))}
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {formatDate(alert.created_at)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-end gap-2">
                    {!alert.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="gap-2"
                      >
                        <Check className="h-3 w-3" />
                        Marcar como lido
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="gap-2"
                    >
                      <X className="h-3 w-3" />
                      Descartar
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

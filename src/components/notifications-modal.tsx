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
import { useState } from 'react';
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

  const alerts = alertsResponse?.data ?? [];
  const visibleAlerts = alerts.filter(
    (alert) => !alert.is_dismissed && !dismissedAlerts.has(alert.id),
  );

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
      info: 'Informação',
      warning: 'Aviso',
      error: 'Erro',
      success: 'Sucesso',
    };
    return types[type] || type;
  };

  const getAlertTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      info: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
      warning:
        'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
      error: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
      success:
        'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    };
    return colors[type] || 'text-gray-600 bg-gray-50 dark:bg-gray-950';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
          <DialogDescription>
            Gerencie seus alertas e notificações
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mb-3" />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 space-y-3 transition-all ${
                  alert.is_read
                    ? 'bg-background'
                    : 'bg-accent border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getAlertTypeColor(alert.alert_type)}`}
                      >
                        {getAlertTypeLabel(alert.alert_type)}
                      </span>
                      {!alert.is_read && (
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                          Não lido
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


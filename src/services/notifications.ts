import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CANAL_ID = 'lembretes-sete-ervas';

// Configura o comportamento da notificação quando o app está aberto na tela (Foreground)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Solicita permissão ao usuário para disparar notificações.
 */
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
    if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const permissao = await window.Notification.requestPermission();
            return permissao === 'granted';
        }
        return false;
    }

    try {
        const { status: statusAtual } = await Notifications.getPermissionsAsync();
        let statusFinal = statusAtual;

        if (statusAtual !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            statusFinal = status;
        }

        if (statusFinal !== 'granted') {
            return false;
        }

        // Configura o canal no Android após obter permissão
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync(CANAL_ID, {
                name: 'Lembretes de Cuidados 🌿',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#10DE80',
                sound: 'default',
            });
        }

        return true;
    } catch (erro) {
        console.error('[Notificações] Erro ao solicitar permissões:', erro);
        return false;
    }
}

export interface DadosNotificacaoAgendada {
    titulo: string;
    corpo: string;
    hora: number;
    minuto: number;
    dadosExtras?: Record<string, any>;
}

/**
 * Agenda uma notificação diária personalizada no horário determinado (HH:MM).
 * Retorna o ID gerado para permitir cancelamento posterior.
 */
export async function agendarNotificacaoDiaria({
    titulo,
    corpo,
    hora,
    minuto,
    dadosExtras,
}: DadosNotificacaoAgendada): Promise<string | null> {
    try {
        const permitiu = await solicitarPermissaoNotificacoes();
        if (!permitiu) {
            console.warn('[Notificações] Permissão negada pelo usuário.');
            return null;
        }

        if (Platform.OS === 'web') {
            console.log(`[Notificações Web] Lembrete diário agendado para ${hora}:${minuto} - "${titulo}"`);
            return `web_${Date.now()}`;
        }

        const idNotificacao = await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: corpo,
                data: dadosExtras,
                sound: 'default',
                ...(Platform.OS === 'android' ? { channelId: CANAL_ID } : {}),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hora,
                minute: minuto,
            },
        });

        return idNotificacao;
    } catch (erro) {
        console.error('[Notificações] Erro ao agendar notificação:', erro);
        return null;
    }
}

/**
 * Dispara uma notificação imediata personalizada (ideal para testes ou avisos instantâneos).
 */
export async function dispararNotificacaoInstantanea(
    titulo: string,
    corpo: string,
    dadosExtras?: Record<string, any>
): Promise<string | null> {
    try {
        const permitiu = await solicitarPermissaoNotificacoes();
        if (!permitiu) {
            return null;
        }

        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                new window.Notification(titulo, { body: corpo });
                return `web_${Date.now()}`;
            }
            return null;
        }

        const idNotificacao = await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: corpo,
                data: dadosExtras,
                sound: 'default',
                ...(Platform.OS === 'android' ? { channelId: CANAL_ID } : {}),
            },
            trigger: null, // null dispara na hora
        });

        return idNotificacao;
    } catch (erro) {
        console.error('[Notificações] Erro ao disparar notificação instantânea:', erro);
        return null;
    }
}

/**
 * Cancela uma notificação agendada pelo seu ID.
 */
export async function cancelarNotificacao(idNotificacao?: string): Promise<void> {
    if (!idNotificacao) return;

    if (Platform.OS === 'web') {
        return;
    }

    try {
        await Notifications.cancelScheduledNotificationAsync(idNotificacao);
    } catch (erro) {
        console.error(`[Notificações] Erro ao cancelar notificação (${idNotificacao}):`, erro);
    }
}

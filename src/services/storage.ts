import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chaves centralizadas para armazenamento persistente local do Sete Ervas.
 */
export const CHAVES_STORAGE = {
    COLECAO_PLANTAS: '@sete_ervas:colecao',
    TAREFAS_CUIDADOS: '@sete_ervas:tarefas',
    USUARIO_LOGADO: '@sete_ervas:usuario',
    NOTIFICACOES_CONFIG: '@sete_ervas:notificacoes',
} as const;

/**
 * Salva qualquer dado serializável em JSON no AsyncStorage.
 */
export async function salvarDados<T>(chave: string, valor: T): Promise<boolean> {
    try {
        const jsonValue = JSON.stringify(valor);
        await AsyncStorage.setItem(chave, jsonValue);
        return true;
    } catch (erro) {
        console.error(`[Storage] Erro ao salvar dados na chave "${chave}":`, erro);
        return false;
    }
}

/**
 * Recupera e desserializa um dado salvo em JSON no AsyncStorage.
 * Retorna null se a chave não existir ou em caso de falha.
 */
export async function buscarDados<T>(chave: string): Promise<T | null> {
    try {
        const jsonValue = await AsyncStorage.getItem(chave);
        if (jsonValue === null) {
            return null;
        }
        return JSON.parse(jsonValue) as T;
    } catch (erro) {
        console.error(`[Storage] Erro ao buscar dados da chave "${chave}":`, erro);
        return null;
    }
}

/**
 * Remove uma chave específica do AsyncStorage.
 */
export async function removerDados(chave: string): Promise<boolean> {
    try {
        await AsyncStorage.removeItem(chave);
        return true;
    } catch (erro) {
        console.error(`[Storage] Erro ao remover chave "${chave}":`, erro);
        return false;
    }
}

/**
 * Limpa todos os dados salvos pelo app no AsyncStorage.
 */
export async function limparTudo(): Promise<boolean> {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (erro) {
        console.error('[Storage] Erro ao limpar armazenamento:', erro);
        return false;
    }
}

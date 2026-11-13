import colecaoData from '@/assets/Dados/colecao.json';
import { buscarDados, CHAVES_STORAGE, salvarDados } from '@/services/storage';
import { PlantaColecao } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface PlantContextType {
    plantas: PlantaColecao[];
    totalPlantas: number;
    carregando: boolean;
    alternarFavorita: (plantaId: string) => void;
    adicionarPlanta: (novaPlanta: Omit<PlantaColecao, 'id'>) => void;
    atualizarFotoPlanta: (plantaId: string, novaFotoUri: string) => void;
    atualizarPlanta: (plantaId: string, dadosAtualizados: Partial<PlantaColecao>) => void;
    removerPlanta: (plantaId: string) => void;
    recarregarColecao: () => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
    const [plantas, setPlantas] = useState<PlantaColecao[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Carrega a coleção salva no AsyncStorage na inicialização
    const carregarColecao = async () => {
        try {
            setCarregando(true);
            const salvas = await buscarDados<PlantaColecao[]>(CHAVES_STORAGE.COLECAO_PLANTAS);
            if (salvas !== null && Array.isArray(salvas)) {
                setPlantas(salvas);
            } else {
                // Primeira execução: usa os dados do arquivo JSON
                const dadosIniciais = colecaoData as PlantaColecao[];
                setPlantas(dadosIniciais);
                await salvarDados(CHAVES_STORAGE.COLECAO_PLANTAS, dadosIniciais);
            }
        } catch (erro) {
            console.error('[PlantContext] Erro ao carregar coleção do storage:', erro);
            setPlantas(colecaoData as PlantaColecao[]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarColecao();
    }, []);

    // Atualiza o estado em memória e sincroniza no AsyncStorage
    const atualizarEPersistir = (atualizador: (prev: PlantaColecao[]) => PlantaColecao[]) => {
        setPlantas((prev) => {
            const atualizada = atualizador(prev);
            salvarDados(CHAVES_STORAGE.COLECAO_PLANTAS, atualizada);
            return atualizada;
        });
    };

    // Alterna favorito de uma planta na coleção
    const alternarFavorita = (plantaId: string) => {
        atualizarEPersistir((prev) =>
            prev.map((planta) =>
                planta.id === plantaId ? { ...planta, favorita: !planta.favorita } : planta
            )
        );
    };

    // Adiciona uma nova planta à coleção
    const adicionarPlanta = (novaPlanta: Omit<PlantaColecao, 'id'>) => {
        const id = Date.now().toString();
        const plantaCriada: PlantaColecao = {
            id,
            ...novaPlanta,
        };
        atualizarEPersistir((prev) => [plantaCriada, ...prev]);
    };

    // Atualiza a foto de uma planta (ex: foto tirada com a câmera ou galeria)
    const atualizarFotoPlanta = (plantaId: string, novaFotoUri: string) => {
        atualizarEPersistir((prev) =>
            prev.map((planta) =>
                planta.id === plantaId ? { ...planta, imagem: novaFotoUri } : planta
            )
        );
    };

    // Atualiza quaisquer dados de uma planta existente (nome, categoria, rega, etc.)
    const atualizarPlanta = (plantaId: string, dadosAtualizados: Partial<PlantaColecao>) => {
        atualizarEPersistir((prev) =>
            prev.map((planta) =>
                planta.id === plantaId ? { ...planta, ...dadosAtualizados } : planta
            )
        );
    };

    // Remove uma planta da coleção
    const removerPlanta = (plantaId: string) => {
        atualizarEPersistir((prev) =>
            prev.filter((planta) => String(planta.id) !== String(plantaId))
        );
    };

    const totalPlantas = plantas.length;

    return (
        <PlantContext.Provider
            value={{
                plantas,
                totalPlantas,
                carregando,
                alternarFavorita,
                adicionarPlanta,
                atualizarFotoPlanta,
                atualizarPlanta,
                removerPlanta,
                recarregarColecao: carregarColecao,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
}

export function usePlants() {
    const context = useContext(PlantContext);
    if (!context) {
        throw new Error('usePlants deve ser usado dentro de um PlantProvider');
    }
    return context;
}

import React from 'react';
import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface BaseButtonProps {
    onPress?: () => void;
    titulo?: string;
    style?: StyleProp<ViewStyle>;
}

export interface BaseLinkProps {
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<TextStyle>;
}

export interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export interface TermosState {
    aceitouTermos: boolean;
}

export interface Planta {
    id: number;
    nome: string;
    nome_cientifico: string;
    categoria: string;
    como_cuidar: string;
    beneficios: string;
    imagem?: string;
}

export interface DicaCuidado {
    topico: string;
    descricao: string;
}

export interface PlantaColecao {
    id: string;
    nome: string;
    nomeCientifico?: string;
    categoria?: string;
    local?: string; // ex: 'Quarto', 'Sala', 'Minhas Plantas'
    imagem: string;
    vitalidade: number; // ex: 92 (92%)
    ultimaRega: string; // ex: 'há 2 dias'
    proximaRega?: string; // ex: 'Hoje, 09:00'
    dataPlantio: string; // ex: '03.03.2024'
    favorita?: boolean;
    precisaRegar?: boolean;
    aguaPorDia?: string; // ex: '1x ao dia', '200ml ao dia'
}


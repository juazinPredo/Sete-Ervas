import { Feather } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

export interface BotaoAdicionarProps {
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
}

export function BotaoAdicionar({ onPress, style }: BotaoAdicionarProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.botao,
                pressed && styles.botaoPressionado,
                style
            ]}
            android_ripple={{
                color: '#10DE80', borderless: false
            }}
        >
            {/* Ícone de + branco nítido no fundo verde */}
            <Feather name="plus" size={32} color="#FFFFFF" />
        </Pressable>
    );
}

export default BotaoAdicionar;

const styles = StyleSheet.create({
    botao: {
        position: 'absolute',
        bottom: 125, // Fica suspenso perfeitamente acima da TabBar flutuante
        right: 24,
        width: 60,
        height: 60,
        backgroundColor: '#05614B', 
        borderRadius: 18, // Formato squircle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6, // Sombra suave no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        zIndex: 99,
    },
    botaoPressionado: {
        opacity: 0.85,
        transform: [{ scale: 0.95 }], // Encolhe levemente ao tocar
    },
});

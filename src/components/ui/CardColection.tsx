import React from 'react';
import { StyleSheet, View, useWindowDimensions, StyleProp, ViewStyle, ScrollView } from 'react-native';

export interface CardColection {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardColection({ children, style }: CardColection) {
    const { width, height } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        < ScrollView
            // 'style' define a janela (tamanho do Card, posição, sombra)

            style={[styles.card, {
                width: isMobile ? '90%' : 400, maxHeight:
                    // Garante que o card ocupe no máximo 60% da altura da tela
                    height * 0.60
            }, style]}
            // 'contentContainerStyle' estiliza a área interna
            contentContainerStyle={styles.conteudoInterno}
            // Esconde a barra lateral cinza se você quiser um visual mais limpo
            showsVerticalScrollIndicator={false}
            // Garante rolagem suave e evita travamento ao tocar em botões/inputs
            keyboardShouldPersistTaps="handled"
            bounces={true}
        >
            {children}
        </ScrollView>
    );
}

export default CardColection;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#d3d3d313',
        borderRadius: 15,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        alignSelf: 'center',
        marginTop: 60,
    },
    conteudoInterno: {
        padding: 10, // O padding fica aqui para não "cortar" o scroll nas bordas,
        flexGrow: 1, // Garante que cards com pouco conteúdo continuem preenchendo o espaço,
    },
});

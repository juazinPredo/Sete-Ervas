import { CardSobre } from '@/components/ui/CardSobre';
import { CardTarefas } from '@/components/ui/CardTarefas';
import { CarrosselDicas } from '@/components/ui/CarrosselDicas';
import { HeaderPadrao } from '@/components/ui/HeaderPadrao';
import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function Index() {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    return (
        <View style={[styles.container, isTablet && styles.containerTablet]}>
            {/* Header Padronizado */}
            <HeaderPadrao />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <CardSobre />
                <CardTarefas />
                <CarrosselDicas />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05110E',
    },
    containerTablet: {
        maxWidth: 700,
        alignSelf: 'center',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingBottom: 140, // Espaço para a tabbar flutuante
    },
});

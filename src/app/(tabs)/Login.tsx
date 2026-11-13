import React from 'react';
import { StyleSheet, useWindowDimensions, View, ScrollView } from 'react-native';
import { Entrar } from '@/components/auth/Entrar';
import { HeaderPadrao } from '@/components/ui/HeaderPadrao';

export default function Login() {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    return (
        <View style={[styles.container, isTablet && styles.containerTablet]}>
            <HeaderPadrao />
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Entrar />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05110E',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 120, // Garante folga para a TabBar
    },
    containerTablet: {},
});

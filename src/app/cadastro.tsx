import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Registro } from '@/components/auth/Registro';

export default function Cadastro() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    return (
        <View style={[styles.container, isTablet && styles.containerTablet]}>
            <View style={styles.topBar}>
                <TouchableOpacity 
                    style={styles.botaoVoltar}
                    onPress={() => (router.canGoBack() ? router.back() : router.replace('/Login'))}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={22} color="#10DE80" />
                    <Text style={styles.textoVoltar}>Login</Text>
                </TouchableOpacity>

                <View style={styles.linhaLogo}>
                    <Text style={styles.logoTexto}>SETE ERVAS</Text>
                    <View style={styles.logoPonto} />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Registro />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05110E',
    },
    containerTablet: {},
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingTop: 55,
        paddingBottom: 12,
    },
    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    textoVoltar: {
        color: '#10DE80',
        fontSize: 15,
        fontWeight: '600',
    },
    linhaLogo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoTexto: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
    logoPonto: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#10DE80',
        marginLeft: 5,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
        paddingBottom: 40,
    },
});
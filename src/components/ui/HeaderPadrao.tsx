import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface HeaderPadraoProps {
    saudacao?: string;
    subtitulo?: string;
}

export function HeaderPadrao({ 
    saudacao = 'Olá 🌿', 
    subtitulo = 'Suas plantas estão prosperando' 
}: HeaderPadraoProps) {
    return (
        <View style={styles.header}>
            {/* Linha do Nome do App */}
            <View style={styles.linhaLogo}>
                <Text style={styles.logoTexto}>SETE ERVAS</Text>
                <View style={styles.logoPonto} />
            </View>

            {/* Mensagem de Saudação Padronizada */}
            <View style={styles.secaoSaudacao}>
                <Text style={styles.tituloSaudacao}>{saudacao}</Text>
                <Text style={styles.subtituloSaudacao}>{subtitulo}</Text>
            </View>
        </View>
    );
}

export default HeaderPadrao;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 22,
        paddingTop: 55,
        paddingBottom: 14,
    },
    linhaLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    logoTexto: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    logoPonto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10DE80',
        marginLeft: 6,
    },
    secaoSaudacao: {
        marginTop: 2,
    },
    tituloSaudacao: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtituloSaudacao: {
        color: '#8A9A93',
        fontSize: 15,
        marginTop: 4,
    },
});

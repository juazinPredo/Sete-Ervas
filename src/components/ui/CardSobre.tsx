import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function CardSobre() {
    const handleAbrirGithub = () => {
        Linking.openURL('https://github.com/juazinPredo').catch((erro) => {
            console.error('Erro ao abrir link do GitHub:', erro);
        });
    };

    return (
        <View style={styles.cardContainer}>
            {/* Topo do Card com Badge do Projeto */}
            <View style={styles.header}>
                <View style={styles.iconeWrapper}>
                    <Ionicons name="school-outline" size={18} color="#10DE80" />
                </View>
                <View style={styles.tituloContainer}>
                    <Text style={styles.titulo}>Projeto Sete Ervas</Text>
                    <Text style={styles.subtitulo}>Autoria & Identificação Acadêmica</Text>
                </View>
            </View>

            {/* Texto Descritivo Solicitado */}
            <Text style={styles.textoDescricao}>
                Projeto Sete Ervas desenvolvido pelo aluno{' '}
                <Text style={styles.destaqueTexto}>João Pedro Mendes do Nascimento</Text>, com o intuito de
                ajudar no cuidado de plantas e hortas caseiras. Versão 1.0
            </Text>

            {/* Botão Interativo com Link para o GitHub */}
            <TouchableOpacity
                style={styles.botaoGithub}
                activeOpacity={0.75}
                onPress={handleAbrirGithub}
            >
                <View style={styles.githubConteudo}>
                    <Ionicons name="logo-github" size={22} color="#10DE80" />
                    <View style={styles.githubTextos}>
                        <Text style={styles.rotuloGithub}>Link para GitHub</Text>
                        <Text style={styles.urlGithub}>https://github.com/juazinPredo</Text>
                    </View>
                </View>
                <Feather name="external-link" size={16} color="#10DE80" />
            </TouchableOpacity>
        </View>
    );
}

export default CardSobre;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#0B2B22',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 18,
        marginTop: 6,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    iconeWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#072019',
        borderWidth: 1,
        borderColor: '#134233',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloContainer: {
        flex: 1,
    },
    titulo: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    subtitulo: {
        color: '#10DE80',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    textoDescricao: {
        color: '#8A9A93',
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
    },
    destaqueTexto: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    botaoGithub: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#072019',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#134233',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    githubConteudo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 8,
    },
    githubTextos: {
        flex: 1,
    },
    rotuloGithub: {
        color: '#8A9A93',
        fontSize: 11,
        fontWeight: '500',
    },
    urlGithub: {
        color: '#10DE80',
        fontSize: 13,
        fontWeight: '700',
    },
});

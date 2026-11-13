import dicasData from '@/assets/Dados/dicas.json';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

export interface ItemDicaCuidado {
    titulo: string;
    descricao: string;
    icone: keyof typeof Ionicons.glyphMap;
}

export interface DicaPlanta {
    id: string;
    planta: string;
    tipo: string;
    emoji: string;
    dicas: ItemDicaCuidado[];
}

export const DICAS_PLANTAS: DicaPlanta[] = dicasData as DicaPlanta[];

export function CarrosselDicas() {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
    const indiceAtualRef = useRef(0);
    const [isPausado, setIsPausado] = useState(false);
    const pausaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cardWidth = isTablet ? Math.min(width, 700) - 42 : width - 42;
    const GAP = 12;

    // Pausa temporária caso o usuário interaja manualmente (toque ou arraste)
    const pausarTemporariamente = () => {
        setIsPausado(true);
        if (pausaTimeoutRef.current) {
            clearTimeout(pausaTimeoutRef.current);
        }
        pausaTimeoutRef.current = setTimeout(() => {
            setIsPausado(false);
        }, 5000);
    };

    // Avanço automático contínuo
    useEffect(() => {
        if (isPausado) return;

        const intervalo = setInterval(() => {
            indiceAtualRef.current = (indiceAtualRef.current + 1) % DICAS_PLANTAS.length;
            scrollRef.current?.scrollTo({
                x: indiceAtualRef.current * (cardWidth + GAP),
                animated: true,
            });
        }, 4000);

        return () => clearInterval(intervalo);
    }, [cardWidth, isPausado]);

    // Limpa timeout pendente ao desmontar
    useEffect(() => {
        return () => {
            if (pausaTimeoutRef.current) {
                clearTimeout(pausaTimeoutRef.current);
            }
        };
    }, []);

    return (
        <View style={styles.wrapper}>
            {/* Carrossel Horizontal com Avanço Automático */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled={false}
                snapToInterval={cardWidth + GAP}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScrollBeginDrag={pausarTemporariamente}
                onTouchStart={pausarTemporariamente}
                onMomentumScrollEnd={(e) => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    indiceAtualRef.current = Math.round(offsetX / (cardWidth + GAP));
                }}
                contentContainerStyle={[styles.scrollContent, { gap: GAP }]}
                nestedScrollEnabled={true}
            >
                {DICAS_PLANTAS.map((item) => (
                    <View
                        key={item.id}
                        style={[styles.card, { width: cardWidth }]}
                    >
                        {/* Topo exatamente como solicitado: DICA 💡 (em negrito) */}
                        <View style={styles.topoCard}>
                            <Text style={styles.topoDica}>DICA 💡</Text>

                            <View style={styles.badgeCategoria}>
                                <Text style={styles.badgeCategoriaTexto}>{item.tipo}</Text>
                            </View>
                        </View>

                        {/* A planta (em negrito) */}
                        <View style={styles.plantaLinha}>
                            <View style={styles.plantaTextoContainer}>
                                <Text style={styles.labelPlanta}>
                                    Planta: <Text style={styles.nomePlanta}>{item.planta}</Text>
                                </Text>
                            </View>
                            <Text style={styles.emojiPlanta}>{item.emoji}</Text>
                        </View>

                        <View style={styles.divisor} />

                        {/* 2 pontos de dicas carregados dinamicamente do JSON */}
                        <View style={styles.cuidadosContainer}>
                            {item.dicas.map((dica, idx) => (
                                <View key={idx} style={styles.itemCuidado}>
                                    <View style={styles.iconeWrapper}>
                                        <Ionicons name={dica.icone} size={15} color="#10DE80" />
                                    </View>
                                    <View style={styles.conteudoCuidado}>
                                        <Text style={styles.tituloCuidado}>{dica.titulo}</Text>
                                        <Text style={styles.descricaoCuidado}>{dica.descricao}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default CarrosselDicas;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
        marginTop: 2,
    },
    scrollContent: {
        paddingVertical: 2,
    },
    card: {
        backgroundColor: '#0B2B22',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 13,
    },
    topoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    topoDica: {
        color: '#10DE80',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    badgeCategoria: {
        backgroundColor: '#072019',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#134233',
    },
    badgeCategoriaTexto: {
        color: '#8A9A93',
        fontSize: 10,
        fontWeight: '600',
    },
    plantaLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    plantaTextoContainer: {
        flex: 1,
    },
    labelPlanta: {
        color: '#8A9A93',
        fontSize: 13,
    },
    nomePlanta: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },
    emojiPlanta: {
        fontSize: 22,
        marginLeft: 8,
    },
    divisor: {
        height: 1,
        backgroundColor: '#134233',
        marginBottom: 9,
    },
    cuidadosContainer: {
        gap: 8,
    },
    itemCuidado: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    iconeWrapper: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#072019',
        borderWidth: 1,
        borderColor: '#134233',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
    },
    conteudoCuidado: {
        flex: 1,
    },
    tituloCuidado: {
        color: '#10DE80',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    descricaoCuidado: {
        color: '#D4E2DC',
        fontSize: 12,
        lineHeight: 16,
    },
});

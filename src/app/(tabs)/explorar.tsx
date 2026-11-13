import { HeaderPadrao } from '@/components/ui/HeaderPadrao';
import hortaData from '@/constants/horta.json';
import { Planta } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';


// Abas de Filtro de Plantas
const CATEGORIAS = [
    'Todas', 'Erva Aromática', 'Medicinal', 'Condimento', 'Hortaliça Folhosa', 'Outras',
];

//Função Principal 
export default function Explorar() {
    // Pega o tamanho da tela para responsividade de dispositivos mobile.
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    // Estados de busca, filtro por categoria e modal de detalhes
    const [busca, setBusca] = useState('');
    const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
    const [plantaSelecionada, setPlantaSelecionada] = useState <Planta | null> (null);

    // Lista de plantas carregadas atraves do JSON horta.json
    const todasPlantas: Planta[] = hortaData.horta_domestica.plantas;

    // Filtragem em tempo real por busca e categoria
    const plantasFiltradas = useMemo(() => {
        return todasPlantas.filter((planta) => {
            // Filtro por texto digitado (nome, nome científico ou benefícios)
            const termoBusca = busca.toLowerCase().trim();
            const bateNome = planta.nome.toLowerCase().includes(termoBusca);
            const bateCientifico = planta.nome_cientifico.toLowerCase().includes(termoBusca);
            const bateBeneficio = planta.beneficios.toLowerCase().includes(termoBusca);
            const bateTexto = termoBusca === '' || bateNome || bateCientifico || bateBeneficio;

            // Filtro por categoria
            let bateCategoria = true;
            if (categoriaAtiva === 'Todas') {
                bateCategoria = true;
            } else if (categoriaAtiva === 'Outras') {
                bateCategoria = !planta.categoria.includes('Erva') &&
                    !planta.categoria.includes('Medicinal') &&
                    !planta.categoria.includes('Condimento') &&
                    !planta.categoria.includes('Folhosa');
            } else {
                bateCategoria = planta.categoria.toLowerCase().includes(categoriaAtiva.toLowerCase());
            }

            return bateTexto && bateCategoria;
        });
    }, [todasPlantas, busca, categoriaAtiva]);

    return (
        <View style={styles.container}>
            {/* Header Padronizado (Sem sino e sem bola com 'J') */}
            <HeaderPadrao />

            {/* Listagem de Plantas Otimizada com FlatList e Virtualização */}
            <FlatList
                key={isTablet ? 'tablet_grid_3' : 'mobile_grid_2'}
                data={plantasFiltradas}
                keyExtractor={(item) => String(item.id)}
                numColumns={isTablet ? 3 : 2}
                columnWrapperStyle={styles.colunasWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <View>
                        {/* 3. BARRA DE BUSCA EM TEMPO REAL */}
                        <View style={styles.containerBusca}>
                            <Feather name="search" size={20} color="#4A7C6B" style={styles.iconeBusca} />
                            <TextInput
                                style={styles.inputBusca}
                                placeholder="Buscar plantas, ervas ou benefícios..."
                                placeholderTextColor="#4A7C6B"
                                value={busca}
                                onChangeText={setBusca}
                            />
                            {busca.length > 0 && (
                                <TouchableOpacity onPress={() => setBusca('')} style={styles.botaoLimpar}>
                                    <Feather name="x" size={18} color="#4A7C6B" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* 4. FILTROS HORIZONTAIS POR CATEGORIA (CHIPS) */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.containerChips}
                        >
                            {CATEGORIAS.map((cat) => {
                                const ativa = categoriaAtiva === cat;
                                return (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setCategoriaAtiva(cat)}
                                        style={[styles.chip, ativa ? styles.chipAtivo : styles.chipInativo]}
                                    >
                                        <Text style={[styles.textoChip, ativa ? styles.textoChipAtivo : styles.textoChipInativo]}>
                                            {cat}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        {/* 5. CONTADOR DE RESULTADOS */}
                        <View style={styles.linhaResultado}>
                            <Text style={styles.contadorTexto}>
                                Exibindo <Text style={styles.contadorDestaque}>{plantasFiltradas.length}</Text> plantas
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.containerVazio}>
                        <Feather name="info" size={36} color="#4A7C6B" />
                        <Text style={styles.textoVazio}>Nenhuma planta encontrada para sua busca.</Text>
                    </View>
                }
                renderItem={({ item: planta }) => (
                    <TouchableOpacity
                        style={[styles.cardPlanta, isTablet && styles.cardPlantaTablet]}
                        activeOpacity={0.85}
                        onPress={() => setPlantaSelecionada(planta)}
                    >
                        <View style={styles.containerImagem}>
                            <Image
                                source={{ uri: planta.imagem }}
                                style={styles.imagemPlanta}
                            />
                            {/* Etiqueta de Categoria sobre a foto */}
                            <View style={styles.tagCategoria}>
                                <Text style={styles.textoTagCategoria} numberOfLines={1}>
                                    {planta.categoria.split('/')[0].trim()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoPlanta}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.nomePlanta} numberOfLines={1}>
                                    {planta.nome}
                                </Text>
                                <Text style={styles.nomeCientifico} numberOfLines={1}>
                                    {planta.nome_cientifico}
                                </Text>
                            </View>

                            <Ionicons
                                name="sparkles"
                                size={16}
                                color="#10DE80"
                                style={styles.iconeCard}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* 7. MODAL COM DETALHES COMPLETOS DA PLANTA CLICADA */}
            <Modal
                visible={plantaSelecionada !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPlantaSelecionada(null)}
            >
                <View style={styles.fundoModal}>
                    <View style={styles.conteudoModal}>
                        {plantaSelecionada && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.topoModal}>
                                    <View style={styles.barraArrasto} />
                                    <TouchableOpacity
                                        style={styles.botaoFecharModal}
                                        onPress={() => setPlantaSelecionada(null)}
                                    >
                                        <Feather name="x" size={22} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>

                                <Image
                                    source={{ uri: plantaSelecionada.imagem }}
                                    style={styles.imagemModal}
                                />

                                <View style={styles.corpoModal}>
                                    <View style={styles.badgeCategoriaModal}>
                                        <Text style={styles.badgeCategoriaTexto}>
                                            {plantaSelecionada.categoria}
                                        </Text>
                                    </View>

                                    <Text style={styles.tituloModal}>{plantaSelecionada.nome}</Text>
                                    <Text style={styles.cientificoModal}>
                                        {plantaSelecionada.nome_cientifico}
                                    </Text>

                                    <View style={styles.blocoInfo}>
                                        <View style={styles.tituloBlocoContainer}>
                                            <Ionicons name="sunny-outline" size={20} color="#10DE80" />
                                            <Text style={styles.tituloBloco}>Como Cuidar:</Text>
                                        </View>
                                        <Text style={styles.textoBloco}>
                                            {plantaSelecionada.como_cuidar}
                                        </Text>
                                    </View>

                                    <View style={styles.blocoInfo}>
                                        <View style={styles.tituloBlocoContainer}>
                                            <Ionicons name="heart-outline" size={20} color="#10DE80" />
                                            <Text style={styles.tituloBloco}>Benefícios:</Text>
                                        </View>
                                        <Text style={styles.textoBloco}>
                                            {plantaSelecionada.beneficios}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05110E',
    },
    scrollContent: {
        paddingBottom: 130, // Deixa folga para não encavalar com a TabBar
    },
    // Topo / Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 55,
        paddingBottom: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerAcoes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    botaoIcone: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#0D261E',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pontoNotificacao: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10DE80',
        position: 'absolute',
        top: 10,
        right: 11,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#05614B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexto: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    // Saudação
    secaoSaudacao: {
        paddingHorizontal: 22,
        marginTop: 18,
        marginBottom: 16,
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
    // Busca
    containerBusca: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B20',
        marginHorizontal: 22,
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#133D2E',
    },
    iconeBusca: {
        marginRight: 10,
    },
    inputBusca: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
    },
    botaoLimpar: {
        padding: 4,
    },
    // Chips de Categoria
    containerChips: {
        paddingHorizontal: 22,
        paddingVertical: 18,
        gap: 10,
    },
    chip: {
        paddingVertical: 9,
        paddingHorizontal: 20,
        borderRadius: 22,
    },
    chipAtivo: {
        backgroundColor: '#10DE80',
    },
    chipInativo: {
        backgroundColor: '#0D261E',
        borderWidth: 1,
        borderColor: '#14382B',
    },
    textoChip: {
        fontSize: 14,
        fontWeight: '700',
    },
    textoChipAtivo: {
        color: '#05110E',
    },
    textoChipInativo: {
        color: '#8A9A93',
    },
    // Contador
    linhaResultado: {
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    contadorTexto: {
        color: '#8A9A93',
        fontSize: 13,
    },
    contadorDestaque: {
        color: '#10DE80',
        fontWeight: 'bold',
    },
    // Grid de Plantas (2 Colunas)
    colunasWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        marginBottom: 14,
    },
    gridPlantas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        gap: 14,
    },
    cardPlanta: {
        width: '47.5%',
        backgroundColor: '#0A2219',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#113527',
        marginBottom: 4,
    },
    cardPlantaTablet: {
        width: '31%',
    },
    containerImagem: {
        width: '100%',
        height: 145,
        position: 'relative',
        backgroundColor: '#071A13',
    },
    imagemPlanta: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tagCategoria: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(5, 17, 14, 0.85)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        maxWidth: '85%',
        borderWidth: 1,
        borderColor: '#113527',
    },
    textoTagCategoria: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    infoPlanta: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nomePlanta: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    nomeCientifico: {
        color: '#7B8E85',
        fontSize: 11,
        fontStyle: 'italic',
        marginTop: 2,
    },
    iconeCard: {
        marginLeft: 4,
    },
    containerVazio: {
        alignItems: 'center',
        paddingVertical: 50,
        gap: 12,
    },
    textoVazio: {
        color: '#8A9A93',
        fontSize: 15,
    },
    // Modal de Detalhes
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    conteudoModal: {
        backgroundColor: '#0A2017',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '85%',
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: '#163E30',
    },
    topoModal: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        paddingTop: 10,
        position: 'relative',
        zIndex: 20,
    },
    barraArrasto: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#1C4D3D',
    },
    botaoFecharModal: {
        position: 'absolute',
        right: 18,
        top: 9,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#05110E',
        borderWidth: 1,
        borderColor: '#163E30',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
        elevation: 5,
    },
    imagemModal: {
        width: '100%',
        height: 225, // Reduzida em 5 pixels para não sobrepor o botão de fechar
        resizeMode: 'cover',
    },
    corpoModal: {
        padding: 22,
    },
    badgeCategoriaModal: {
        alignSelf: 'flex-start',
        backgroundColor: '#10DE80',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    badgeCategoriaTexto: {
        color: '#05110E',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tituloModal: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },
    cientificoModal: {
        color: '#8A9A93',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    blocoInfo: {
        backgroundColor: '#0D281F',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#163E30',
    },
    tituloBlocoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tituloBloco: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textoBloco: {
        color: '#8A9A93',
        fontSize: 14,
        lineHeight: 22,
    },
});

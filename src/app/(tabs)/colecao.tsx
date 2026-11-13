import { BotaoAdicionar } from '@components/ui/BotaoAdicionar';
import { HeaderPadrao } from '@/components/ui/HeaderPadrao';
import { usePlants } from '@/context/PlantContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageSourcePropType,
    Keyboard,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

const CATEGORIAS_MODAL = [
    'Chás',
    'Flor / Ornamento',
    'Horta / Tempero',
    'Suculenta / Cacto',
] as const;

// Placeholders locais oficiais da pasta assets/images/Plantas-Rep
const IMAGENS_PLACEHOLDER: Record<string, any> = {
    'Chás': require('../../../assets/images/Plantas-Rep/Chás.jpg'),
    'Flor / Ornamento': require('../../../assets/images/Plantas-Rep/Flor-ornamento.jpg'),
    'Horta / Tempero': require('../../../assets/images/Plantas-Rep/Horta-tempero.jpg'),
    'Suculenta / Cacto': require('../../../assets/images/Plantas-Rep/Suculenta-cactos.jpg'),
};

// Resolver inteligente que suporta fotos tiradas com a câmera (file://), URLs remotas e os placeholders locais
export const resolverOrigemImagem = (imagem?: string, categoria?: string): ImageSourcePropType => {
    if (
        !imagem ||
        imagem === 'placeholder' ||
        imagem.startsWith('placeholder:') ||
        IMAGENS_PLACEHOLDER[imagem]
    ) {
        const catChave = (imagem?.replace('placeholder:', '') || categoria || 'Chás') as keyof typeof IMAGENS_PLACEHOLDER;
        return IMAGENS_PLACEHOLDER[catChave] || IMAGENS_PLACEHOLDER['Chás'];
    }

    if (imagem === 'Chás.jpg' || imagem.includes('Chás')) return IMAGENS_PLACEHOLDER['Chás'];
    if (imagem === 'Flor-ornamento.jpg' || imagem.includes('Flor')) return IMAGENS_PLACEHOLDER['Flor / Ornamento'];
    if (imagem === 'Horta-tempero.jpg' || imagem.includes('Horta')) return IMAGENS_PLACEHOLDER['Horta / Tempero'];
    if (imagem === 'Suculenta-cactos.jpg' || imagem.includes('Suculenta') || imagem.includes('Cacto')) {
        return IMAGENS_PLACEHOLDER['Suculenta / Cacto'];
    }

    return { uri: imagem };
};

export default function CuidadosPlanta() {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const { plantas, alternarFavorita, adicionarPlanta, atualizarPlanta, removerPlanta, carregando } = usePlants();

    // Estados do Modal de Criação (Nova Planta)
    const [modalVisivel, setModalVisivel] = useState(false);
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState<string>('Chás');
    const [aguaPorDia, setAguaPorDia] = useState('1x ao dia');
    const [fotoUri, setFotoUri] = useState<string | null>(null);

    // Estados do Modal de Edição (Configurações / Alterar Planta)
    const [plantaEmEdicao, setPlantaEmEdicao] = useState<any>(null);
    const [nomeEdicao, setNomeEdicao] = useState('');
    const [categoriaEdicao, setCategoriaEdicao] = useState<string>('Chás');
    const [aguaPorDiaEdicao, setAguaPorDiaEdicao] = useState('1x ao dia');
    const [fotoUriEdicao, setFotoUriEdicao] = useState<string | null>(null);

    const handleAbrirModal = () => {
        setNome('');
        setCategoria('Chás');
        setAguaPorDia('1x ao dia');
        setFotoUri(null);
        setModalVisivel(true);
    };

    const handleFecharModal = () => {
        setModalVisivel(false);
        setNome('');
        setCategoria('Chás');
        setAguaPorDia('');
        setFotoUri(null);
        Keyboard.dismiss();
    };

    // Abre o modal de configurações da planta selecionada
    const handleAbrirEdicao = (planta: any) => {
        setPlantaEmEdicao(planta);
        setNomeEdicao(planta.nome);
        setCategoriaEdicao(planta.categoria || 'Chás');
        setAguaPorDiaEdicao(planta.aguaPorDia || '1x ao dia');

        // Se a foto for uma imagem personalizada e não apenas a chave de placeholder
        if (
            planta.imagem &&
            !planta.imagem.startsWith('placeholder:') &&
            !IMAGENS_PLACEHOLDER[planta.imagem] &&
            planta.imagem !== 'placeholder' &&
            !planta.imagem.endsWith('.jpg')
        ) {
            setFotoUriEdicao(planta.imagem);
        } else {
            setFotoUriEdicao(null);
        }
    };

    const handleFecharEdicao = () => {
        setPlantaEmEdicao(null);
        setNomeEdicao('');
        setCategoriaEdicao('Chás');
        setAguaPorDiaEdicao('');
        setFotoUriEdicao(null);
        Keyboard.dismiss();
    };

    // Tira foto para a alteração da planta no modal de edição
    const tirarFotoEdicao = async () => {
        try {
            const permissao = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissao.granted) {
                Alert.alert(
                    'Permissão Necessária',
                    'Autorize o acesso à câmera para fotografar sua planta.'
                );
                return;
            }

            const resultado = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setFotoUriEdicao(resultado.assets[0].uri);
            }
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
            console.error('Erro ao abrir câmera:', erro);
        }
    };

    // Escolhe foto da galeria para a alteração da planta no modal de edição
    const escolherFotoGaleriaEdicao = async () => {
        try {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
                Alert.alert(
                    'Permissão Necessária',
                    'Autorize o acesso à galeria para escolher a foto da planta.'
                );
                return;
            }

            const resultado = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setFotoUriEdicao(resultado.assets[0].uri);
            }
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível acessar a galeria.');
            console.error('Erro ao abrir galeria:', erro);
        }
    };

    // Salva as alterações feitas na planta
    const handleSalvarEdicao = () => {
        if (!plantaEmEdicao) return;
        const nomeLimpo = nomeEdicao.trim();
        if (!nomeLimpo) {
            Alert.alert('Nome Obrigatório', 'Por favor, digite o nome da planta.');
            return;
        }

        const imagemFinal = fotoUriEdicao || `placeholder:${categoriaEdicao}`;

        atualizarPlanta(plantaEmEdicao.id, {
            nome: nomeLimpo,
            categoria: categoriaEdicao,
            aguaPorDia: aguaPorDiaEdicao.trim() || '1x ao dia',
            imagem: imagemFinal,
        });

        handleFecharEdicao();
        Alert.alert('Planta Atualizada! 🌿', `"${nomeLimpo}" foi atualizada com sucesso.`);
    };

    // Exclui a planta da coleção diretamente
    const handleExcluirPlanta = () => {
        if (!plantaEmEdicao) return;
        const idParaRemover = plantaEmEdicao.id;
        removerPlanta(idParaRemover);
        handleFecharEdicao();
    };

    // Tira foto para a nova planta dentro do modal
    const tirarFotoModal = async () => {
        try {
            const permissao = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissao.granted) {
                Alert.alert(
                    'Permissão Necessária',
                    'Autorize o acesso à câmera para fotografar sua nova planta.'
                );
                return;
            }

            const resultado = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setFotoUri(resultado.assets[0].uri);
            }
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
            console.error('Erro ao abrir câmera:', erro);
        }
    };

    // Escolhe foto da galeria para a nova planta dentro do modal
    const escolherFotoGaleriaModal = async () => {
        try {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
                Alert.alert(
                    'Permissão Necessária',
                    'Autorize o acesso à galeria para escolher a foto da planta.'
                );
                return;
            }

            const resultado = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setFotoUri(resultado.assets[0].uri);
            }
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível acessar a galeria.');
            console.error('Erro ao abrir galeria:', erro);
        }
    };

    // Salva a nova planta configurada no modal
    const handleSalvarNovaPlanta = () => {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) {
            Alert.alert('Nome Obrigatório', 'Por favor, digite o nome da planta.');
            return;
        }

        const hojeFormatado = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const imagemFinal = fotoUri || `placeholder:${categoria}`;

        adicionarPlanta({
            nome: nomeLimpo,
            nomeCientifico: 'Cultivo próprio',
            categoria: categoria,
            local: 'Minha Coleção',
            imagem: imagemFinal,
            vitalidade: 100,
            ultimaRega: 'Hoje',
            proximaRega: 'Amanhã',
            dataPlantio: hojeFormatado,
            favorita: false,
            precisaRegar: false,
            aguaPorDia: aguaPorDia.trim() || '1x ao dia',
        });

        handleFecharModal();
        Alert.alert('Planta Cadastrada! 🌱', `"${nomeLimpo}" foi adicionada com sucesso à sua coleção.`);
    };

    return (
        <View style={[styles.container, isTablet && styles.containerTablet]}>
            {/* Header Padronizado */}
            <HeaderPadrao />

            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho da Seção Coleção */}
                <View style={styles.secaoHeader}>
                    <Text style={styles.tituloSecao}>Coleção</Text>
                    <TouchableOpacity
                        style={styles.botaoAdicionarTopo}
                        activeOpacity={0.8}
                        onPress={handleAbrirModal}
                    >
                        <Feather name="plus" size={16} color="#FFFFFF" />
                        <Text style={styles.textoBotaoAdicionarTopo}>Adicionar</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid de 2 Colunas com as Plantas da Coleção, Loading ou Estado Vazio */}
                {carregando ? (
                    <View style={styles.containerCarregando}>
                        <ActivityIndicator size="large" color="#10DE80" />
                        <Text style={styles.textoCarregando}>Carregando sua coleção...</Text>
                    </View>
                ) : plantas.length === 0 ? (
                    <TouchableOpacity
                        style={styles.containerVazio}
                        activeOpacity={0.8}
                        onPress={handleAbrirModal}
                    >
                        <View style={styles.iconeVazioWrapper}>
                            <Ionicons name="leaf-outline" size={32} color="#10DE80" />
                        </View>
                        <Text style={styles.tituloVazio}>Sua coleção está vazia</Text>
                        <Text style={styles.subtituloVazio}>
                            Toque aqui ou no botão + abaixo para cadastrar sua primeira planta.
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.gridPlantas}>
                        {plantas.map((planta) => {
                            const isFav = planta.favorita;
                            return (
                                <View key={planta.id} style={styles.cardPlanta}>
                                    {/* Imagem com Botão de Favorito */}
                                    <View style={styles.imagemContainer}>
                                        <Image
                                            source={resolverOrigemImagem(planta.imagem, planta.categoria)}
                                            style={styles.imagemPlanta}
                                        />

                                        {/* Botão de Favorito (Coração) */}
                                        <TouchableOpacity
                                            style={styles.botaoFavorito}
                                            activeOpacity={0.7}
                                            onPress={() => alternarFavorita(planta.id)}
                                        >
                                            <Ionicons
                                                name={isFav ? 'heart' : 'heart-outline'}
                                                size={18}
                                                color={isFav ? '#FF4D6D' : '#FFFFFF'}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Informações do Card */}
                                    <View style={styles.corpoCard}>
                                        <View style={styles.linhaNomeEMenu}>
                                            <Text
                                                style={styles.nomePlanta}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {planta.nome}
                                            </Text>
                                            <TouchableOpacity
                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                onPress={() => handleAbrirEdicao(planta)}
                                                activeOpacity={0.7}
                                            >
                                                <Feather
                                                    name="more-vertical"
                                                    size={16}
                                                    color="#88A99B"
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.dataPlantio}>{planta.dataPlantio}</Text>

                                        {/* Linha com Categoria e Água por Dia */}
                                        <View style={styles.linhaTagsCard}>
                                            <View style={styles.tagLocal}>
                                                <Text style={styles.textoTagLocal} numberOfLines={1}>
                                                    {planta.categoria || 'Minhas Plantas'}
                                                </Text>
                                            </View>

                                            {planta.aguaPorDia && (
                                                <View style={styles.tagAgua}>
                                                    <Ionicons name="water" size={10} color="#10DE80" />
                                                    <Text style={styles.textoTagAgua} numberOfLines={1}>
                                                        {planta.aguaPorDia}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Botão Flutuante (+) para adicionar nova planta */}
            <BotaoAdicionar onPress={handleAbrirModal} />

            {/* Modal de Nova Planta */}
            <Modal
                visible={modalVisivel}
                animationType="fade"
                transparent={true}
                onRequestClose={handleFecharModal}
            >
                <View style={styles.fundoModal}>
                    <View style={styles.conteudoModal}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.scrollModal}
                        >
                            {/* Topo do Modal */}
                            <View style={styles.topoModal}>
                                <View style={styles.tituloModalContainer}>
                                    <Ionicons name="leaf" size={20} color="#10DE80" />
                                    <Text style={styles.tituloModal}>Nova Planta</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.botaoFecharModal}
                                    onPress={handleFecharModal}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="x" size={20} color="#8A9A93" />
                                </TouchableOpacity>
                            </View>

                            {/* Foto da Planta (Placeholder dinâmico da categoria ou foto personalizada) */}
                            <Text style={styles.labelCampoModal}>Foto da Planta</Text>
                            <View style={styles.previewFotoContainer}>
                                <Image
                                    source={
                                        fotoUri
                                            ? { uri: fotoUri }
                                            : IMAGENS_PLACEHOLDER[categoria] || IMAGENS_PLACEHOLDER['Chás']
                                    }
                                    style={styles.previewFoto}
                                />
                                {fotoUri && (
                                    <View style={styles.badgeTipoFotoModal}>
                                        <Text style={styles.textoBadgeTipoFotoModal}>
                                            Sua foto
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.acoesFotoModal}>
                                    <TouchableOpacity
                                        style={styles.botaoAcaoFotoModal}
                                        onPress={tirarFotoModal}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="camera" size={13} color="#10DE80" />
                                        <Text style={styles.textoBotaoAcaoFoto}>Câmera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.botaoAcaoFotoModal}
                                        onPress={escolherFotoGaleriaModal}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="image" size={13} color="#10DE80" />
                                        <Text style={styles.textoBotaoAcaoFoto}>Galeria</Text>
                                    </TouchableOpacity>
                                    {fotoUri && (
                                        <TouchableOpacity
                                            style={[styles.botaoAcaoFotoModal, styles.botaoRemoverFotoModal]}
                                            onPress={() => setFotoUri(null)}
                                            activeOpacity={0.7}
                                        >
                                            <Feather name="trash-2" size={13} color="#FF4D6D" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Campo 1: Nome da Planta */}
                            <Text style={styles.labelCampoModal}>Nome da Planta *</Text>
                            <View style={styles.inputContainerModal}>
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Ex: Hortelã, Alecrim, Samambaia..."
                                    placeholderTextColor="#5C8274"
                                    value={nome}
                                    onChangeText={setNome}
                                    underlineColorAndroid="transparent"
                                    selectionColor="#10DE80"
                                />
                            </View>

                            {/* Campo 2: Categoria (Chás, Flor/Ornamento, Horta/Tempero, Suculenta/Cacto) */}
                            <Text style={styles.labelCampoModal}>Categoria</Text>
                            <View style={styles.gridCategoriasModal}>
                                {CATEGORIAS_MODAL.map((cat) => {
                                    const selecionada = categoria === cat;
                                    return (
                                        <TouchableOpacity
                                            key={cat}
                                            activeOpacity={0.7}
                                            style={[
                                                styles.chipCategoriaModal,
                                                selecionada && styles.chipCategoriaModalAtivo,
                                            ]}
                                            onPress={() => setCategoria(cat)}
                                        >
                                            <Text
                                                style={[
                                                    styles.textoChipCategoriaModal,
                                                    selecionada && styles.textoChipCategoriaModalAtivo,
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Campo 3: Água por Dia */}
                            <Text style={styles.labelCampoModal}>Água por dia</Text>
                            <View style={styles.inputContainerModal}>
                                <Ionicons name="water-outline" size={18} color="#10DE80" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Ex: 1x ao dia, 200ml ou A cada 2 dias"
                                    placeholderTextColor="#5C8274"
                                    value={aguaPorDia}
                                    onChangeText={setAguaPorDia}
                                    underlineColorAndroid="transparent"
                                    selectionColor="#10DE80"
                                />
                            </View>

                            {/* Sugestões rápidas de frequência de rega */}
                            <View style={styles.linhaSugestoesAgua}>
                                {['1x ao dia', '2x ao dia', 'A cada 2 dias', '1x na semana'].map((sugestao) => (
                                    <TouchableOpacity
                                        key={sugestao}
                                        style={styles.chipSugestaoAgua}
                                        activeOpacity={0.7}
                                        onPress={() => setAguaPorDia(sugestao)}
                                    >
                                        <Text style={styles.textoChipSugestao}>{sugestao}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Rodapé com Botões de Cancelar e Salvar */}
                            <View style={styles.rodapeModal}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.botaoCancelarModal}
                                    onPress={handleFecharModal}
                                >
                                    <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                        styles.botaoSalvarModal,
                                        !nome.trim() && styles.botaoSalvarModalDesabilitado,
                                    ]}
                                    onPress={handleSalvarNovaPlanta}
                                    disabled={!nome.trim()}
                                >
                                    <Text style={styles.textoBotaoSalvarModal}>Salvar Planta</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Configurações / Alterar Planta Selecionada */}
            <Modal
                visible={plantaEmEdicao !== null}
                animationType="fade"
                transparent={true}
                onRequestClose={handleFecharEdicao}
            >
                <View style={styles.fundoModal}>
                    <View style={styles.conteudoModal}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.scrollModal}
                        >
                            {/* Topo do Modal */}
                            <View style={styles.topoModal}>
                                <View style={styles.tituloModalContainer}>
                                    <Ionicons name="settings-outline" size={20} color="#10DE80" />
                                    <Text style={styles.tituloModal}>Configurações da Planta</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.botaoFecharModal}
                                    onPress={handleFecharEdicao}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="x" size={20} color="#8A9A93" />
                                </TouchableOpacity>
                            </View>

                            {/* Foto da Planta (Placeholder dinâmico da categoria ou foto personalizada) */}
                            <Text style={styles.labelCampoModal}>Foto da Planta</Text>
                            <View style={styles.previewFotoContainer}>
                                <Image
                                    source={
                                        fotoUriEdicao
                                            ? { uri: fotoUriEdicao }
                                            : IMAGENS_PLACEHOLDER[categoriaEdicao] || IMAGENS_PLACEHOLDER['Chás']
                                    }
                                    style={styles.previewFoto}
                                />
                                {fotoUriEdicao && (
                                    <View style={styles.badgeTipoFotoModal}>
                                        <Text style={styles.textoBadgeTipoFotoModal}>
                                            Foto personalizada
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.acoesFotoModal}>
                                    <TouchableOpacity
                                        style={styles.botaoAcaoFotoModal}
                                        onPress={tirarFotoEdicao}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="camera" size={13} color="#10DE80" />
                                        <Text style={styles.textoBotaoAcaoFoto}>Câmera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.botaoAcaoFotoModal}
                                        onPress={escolherFotoGaleriaEdicao}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="image" size={13} color="#10DE80" />
                                        <Text style={styles.textoBotaoAcaoFoto}>Galeria</Text>
                                    </TouchableOpacity>
                                    {fotoUriEdicao && (
                                        <TouchableOpacity
                                            style={[styles.botaoAcaoFotoModal, styles.botaoRemoverFotoModal]}
                                            onPress={() => setFotoUriEdicao(null)}
                                            activeOpacity={0.7}
                                        >
                                            <Feather name="trash-2" size={13} color="#FF4D6D" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Campo 1: Nome da Planta */}
                            <Text style={styles.labelCampoModal}>Nome da Planta *</Text>
                            <View style={styles.inputContainerModal}>
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Nome da planta..."
                                    placeholderTextColor="#5C8274"
                                    value={nomeEdicao}
                                    onChangeText={setNomeEdicao}
                                    underlineColorAndroid="transparent"
                                    selectionColor="#10DE80"
                                />
                            </View>

                            {/* Campo 2: Categoria (Chás, Flor/Ornamento, Horta/Tempero, Suculenta/Cacto) */}
                            <Text style={styles.labelCampoModal}>Categoria</Text>
                            <View style={styles.gridCategoriasModal}>
                                {CATEGORIAS_MODAL.map((cat) => {
                                    const selecionada = categoriaEdicao === cat;
                                    return (
                                        <TouchableOpacity
                                            key={cat}
                                            activeOpacity={0.7}
                                            style={[
                                                styles.chipCategoriaModal,
                                                selecionada && styles.chipCategoriaModalAtivo,
                                            ]}
                                            onPress={() => setCategoriaEdicao(cat)}
                                        >
                                            <Text
                                                style={[
                                                    styles.textoChipCategoriaModal,
                                                    selecionada && styles.textoChipCategoriaModalAtivo,
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Campo 3: Água por Dia */}
                            <Text style={styles.labelCampoModal}>Água por dia</Text>
                            <View style={styles.inputContainerModal}>
                                <Ionicons name="water-outline" size={18} color="#10DE80" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Ex: 1x ao dia, 200ml ou A cada 2 dias"
                                    placeholderTextColor="#5C8274"
                                    value={aguaPorDiaEdicao}
                                    onChangeText={setAguaPorDiaEdicao}
                                    underlineColorAndroid="transparent"
                                    selectionColor="#10DE80"
                                />
                            </View>

                            {/* Sugestões rápidas de frequência de rega */}
                            <View style={styles.linhaSugestoesAgua}>
                                {['1x ao dia', '2x ao dia', 'A cada 2 dias', '1x na semana'].map((sugestao) => (
                                    <TouchableOpacity
                                        key={sugestao}
                                        style={styles.chipSugestaoAgua}
                                        activeOpacity={0.7}
                                        onPress={() => setAguaPorDiaEdicao(sugestao)}
                                    >
                                        <Text style={styles.textoChipSugestao}>{sugestao}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Botão para Excluir a Planta da Coleção */}
                            <TouchableOpacity
                                style={styles.botaoExcluirPlantaModal}
                                onPress={handleExcluirPlanta}
                                activeOpacity={0.7}
                            >
                                <Feather name="trash-2" size={16} color="#FF4D6D" />
                                <Text style={styles.textoBotaoExcluirPlanta}>Excluir planta da coleção</Text>
                            </TouchableOpacity>

                            {/* Rodapé com Botões de Cancelar e Salvar */}
                            <View style={styles.rodapeModal}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.botaoCancelarModal}
                                    onPress={handleFecharEdicao}
                                >
                                    <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                        styles.botaoSalvarModal,
                                        !nomeEdicao.trim() && styles.botaoSalvarModalDesabilitado,
                                    ]}
                                    onPress={handleSalvarEdicao}
                                    disabled={!nomeEdicao.trim()}
                                >
                                    <Text style={styles.textoBotaoSalvarModal}>Salvar Alterações</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    containerTablet: {
        maxWidth: 700,
        alignSelf: 'center',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingBottom: 150, // Evita sobreposição com o botão flutuante e tab bar
    },
    secaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
    },
    tituloSecao: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },
    botaoAdicionarTopo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A251D',
        borderWidth: 1,
        borderColor: '#164234',
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 14,
        gap: 6,
    },
    textoBotaoAdicionarTopo: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    gridPlantas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
    },
    cardPlanta: {
        width: '48%',
        backgroundColor: '#0B2B22',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#134233',
        overflow: 'hidden',
    },
    imagemContainer: {
        width: '100%',
        height: 140,
        position: 'relative',
        backgroundColor: '#071F18',
    },
    imagemPlanta: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    botaoFavorito: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corpoCard: {
        padding: 12,
    },
    linhaNomeEMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nomePlanta: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 4,
    },
    dataPlantio: {
        color: '#88A99B',
        fontSize: 11,
        marginTop: 4,
        marginBottom: 8,
    },
    tagLocal: {
        alignSelf: 'flex-start',
        backgroundColor: '#082118',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#10392B',
    },
    textoTagLocal: {
        color: '#A3D9C4',
        fontSize: 11,
        fontWeight: '500',
    },
    linhaTagsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    tagAgua: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A2A20',
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#134233',
        gap: 3,
    },
    textoTagAgua: {
        color: '#10DE80',
        fontSize: 10,
        fontWeight: '600',
    },
    containerVazio: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#072019',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#134233',
        borderStyle: 'dashed',
        marginTop: 10,
    },
    iconeVazioWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0B2B22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    tituloVazio: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    subtituloVazio: {
        color: '#88A99B',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    // Estilos do Modal de Nova Planta
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
    },
    conteudoModal: {
        backgroundColor: '#072019',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 18,
        width: '100%',
        maxWidth: 440,
        maxHeight: '88%',
    },
    scrollModal: {
        paddingBottom: 8,
    },
    topoModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    tituloModalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tituloModal: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botaoFecharModal: {
        padding: 4,
    },
    labelCampoModal: {
        color: '#8A9A93',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 8,
        textTransform: 'uppercase',
    },
    previewFotoContainer: {
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#134233',
        marginBottom: 6,
    },
    previewFoto: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    acoesFotoModal: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 8,
        right: 8,
        gap: 6,
    },
    botaoAcaoFotoModal: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(7, 32, 25, 0.9)',
        borderWidth: 1,
        borderColor: '#134233',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 4,
    },
    textoBotaoAcaoFoto: {
        color: '#10DE80',
        fontSize: 11,
        fontWeight: '600',
    },
    botaoRemoverFotoModal: {
        borderColor: 'rgba(255, 77, 109, 0.4)',
    },
    badgeTipoFotoModal: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(5, 17, 14, 0.85)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#134233',
    },
    textoBadgeTipoFotoModal: {
        color: '#10DE80',
        fontSize: 10,
        fontWeight: 'bold',
    },
    inputContainerModal: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#051813',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#134233',
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    inputModal: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        paddingVertical: 6,
        borderWidth: 0,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    gridCategoriasModal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 6,
    },
    chipCategoriaModal: {
        backgroundColor: '#051813',
        borderWidth: 1,
        borderColor: '#134233',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    chipCategoriaModalAtivo: {
        backgroundColor: '#10DE80',
        borderColor: '#10DE80',
    },
    textoChipCategoriaModal: {
        color: '#8A9A93',
        fontSize: 12,
        fontWeight: '600',
    },
    textoChipCategoriaModalAtivo: {
        color: '#052014',
        fontWeight: 'bold',
    },
    linhaSugestoesAgua: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 6,
        marginBottom: 4,
    },
    chipSugestaoAgua: {
        backgroundColor: '#09251C',
        borderWidth: 1,
        borderColor: '#134233',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    textoChipSugestao: {
        color: '#88A99B',
        fontSize: 11,
    },
    botaoExcluirPlantaModal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 77, 109, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.3)',
        borderRadius: 12,
        paddingVertical: 10,
        marginTop: 14,
        marginBottom: 4,
        gap: 8,
    },
    textoBotaoExcluirPlanta: {
        color: '#FF4D6D',
        fontSize: 13,
        fontWeight: '600',
    },
    rodapeModal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: 18,
    },
    botaoCancelarModal: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#134233',
    },
    textoBotaoCancelar: {
        color: '#8A9A93',
        fontSize: 13,
        fontWeight: '600',
    },
    botaoSalvarModal: {
        backgroundColor: '#10DE80',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    botaoSalvarModalDesabilitado: {
        opacity: 0.4,
    },
    textoBotaoSalvarModal: {
        color: '#052014',
        fontSize: 13,
        fontWeight: 'bold',
    },
    containerCarregando: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    textoCarregando: {
        color: '#8A9A93',
        fontSize: 14,
        fontWeight: '500',
    },
});

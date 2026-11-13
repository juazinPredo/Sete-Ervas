import {
    agendarNotificacaoDiaria,
    cancelarNotificacao,
    dispararNotificacaoInstantanea,
} from '@/services/notifications';
import { buscarDados, CHAVES_STORAGE, salvarDados } from '@/services/storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export interface TarefaItem {
    id: string;
    texto: string;
    concluida: boolean;
    horarioNotificacao?: string;
    idNotificacao?: string;
}

// Função utilitária para formatação e validação de horário (HH:MM)
const formatarHorario = (texto: string, horarioAtual: string): string => {
    // Se o usuário apagou os dois pontos ':' com o backspace
    if (horarioAtual.endsWith(':') && texto === horarioAtual.slice(0, -1)) {
        return texto.slice(0, 1);
    }

    // Bloqueia letras e caracteres especiais — aceita exclusivamente números
    const apenasDigitos = texto.replace(/\D/g, '').slice(0, 4);
    if (!apenasDigitos) return '';

    let h = apenasDigitos.slice(0, 2);
    let m = apenasDigitos.slice(2, 4);

    // Validação de horas: 00 a 23
    if (h.length === 1 && parseInt(h, 10) > 2) {
        h = `0${h}`; // Se digitar 3 a 9, converte automaticamente para 03 a 09
    } else if (h.length === 2 && parseInt(h, 10) > 23) {
        h = '23'; // Nunca permite valor inviável de hora
    }

    // Validação de minutos: 00 a 59
    if (m.length === 1 && parseInt(m, 10) > 5) {
        m = '5'; // Primeiro dígito dos minutos limitado a 5
    } else if (m.length === 2 && parseInt(m, 10) > 59) {
        m = '59'; // Limita minutos a 59
    }

    if (apenasDigitos.length > 2) {
        return `${h}:${m}`;
    } else if (apenasDigitos.length === 2) {
        return `${h}:`;
    }
    return h;
};

// Sanitiza o horário no momento do salvamento
const sanitizarHorarioFinal = (horaStr: string): string => {
    const partes = horaStr.split(':');
    let h = parseInt(partes[0] || '8', 10);
    let m = parseInt(partes[1] || '0', 10);
    if (isNaN(h) || h < 0) h = 8;
    if (h > 23) h = 23;
    if (isNaN(m) || m < 0) m = 0;
    if (m > 59) m = 59;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export function CardTarefas() {
    const [tarefas, setTarefas] = useState<TarefaItem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [novaTarefa, setNovaTarefa] = useState('');
    const [mostrarInput, setMostrarInput] = useState(false);
    const [notificarAtivo, setNotificarAtivo] = useState(false);
    const [horarioNotificacao, setHorarioNotificacao] = useState('');

    // Estado para edição via ícone de 3 pontos
    const [tarefaEmEdicao, setTarefaEmEdicao] = useState<TarefaItem | null>(null);
    const [textoEdicao, setTextoEdicao] = useState('');
    const [notificarEdicao, setNotificarEdicao] = useState(false);
    const [horarioEdicao, setHorarioEdicao] = useState('');

    // Carrega as tarefas salvas localmente ao abrir o app
    useEffect(() => {
        async function carregarTarefasSalvas() {
            try {
                const salvas = await buscarDados<TarefaItem[]>(CHAVES_STORAGE.TAREFAS_CUIDADOS);
                if (salvas !== null && Array.isArray(salvas)) {
                    setTarefas(salvas);
                }
            } catch (erro) {
                console.error('[CardTarefas] Erro ao carregar tarefas do storage:', erro);
            } finally {
                setCarregando(false);
            }
        }
        carregarTarefasSalvas();
    }, []);

    // Atualiza o estado em memória e grava no AsyncStorage
    const atualizarEPersistirTarefas = (atualizador: (prev: TarefaItem[]) => TarefaItem[]) => {
        setTarefas((prev) => {
            const atualizada = atualizador(prev);
            salvarDados(CHAVES_STORAGE.TAREFAS_CUIDADOS, atualizada);
            return atualizada;
        });
    };

    const handleAdicionarTarefa = async () => {
        const textoLimpo = novaTarefa.trim();
        if (!textoLimpo) return;

        let horarioFinal: string | undefined = undefined;
        let idNotificacaoGerado: string | undefined = undefined;

        if (notificarAtivo && horarioNotificacao.trim()) {
            horarioFinal = sanitizarHorarioFinal(horarioNotificacao);
            const [hStr, mStr] = horarioFinal.split(':');
            const h = parseInt(hStr, 10);
            const m = parseInt(mStr, 10);

            const notifId = await agendarNotificacaoDiaria({
                titulo: 'Sete Ervas 🌿 - Hora de Cuidar!',
                corpo: `Lembrete diário: ${textoLimpo}`,
                hora: h,
                minuto: m,
            });

            if (notifId) {
                idNotificacaoGerado = notifId;
            }
        }

        const nova: TarefaItem = {
            id: Date.now().toString(),
            texto: textoLimpo,
            concluida: false,
            horarioNotificacao: horarioFinal,
            idNotificacao: idNotificacaoGerado,
        };

        atualizarEPersistirTarefas((prev) => [nova, ...prev]);
        setNovaTarefa('');
        setHorarioNotificacao('');
        setNotificarAtivo(false);
        setMostrarInput(false);
        Keyboard.dismiss();
    };

    const handleAlternarTarefa = (id: string) => {
        atualizarEPersistirTarefas((prev) =>
            prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
        );
    };

    const handleRemoverTarefa = async (id: string) => {
        const tarefa = tarefas.find((t) => t.id === id);
        if (tarefa?.idNotificacao) {
            await cancelarNotificacao(tarefa.idNotificacao);
        }
        atualizarEPersistirTarefas((prev) => prev.filter((t) => t.id !== id));
    };

    // Abre modal para alterar a tarefa selecionada
    const handleAbrirEdicao = (tarefa: TarefaItem) => {
        setTarefaEmEdicao(tarefa);
        setTextoEdicao(tarefa.texto);
        if (tarefa.horarioNotificacao) {
            setNotificarEdicao(true);
            setHorarioEdicao(tarefa.horarioNotificacao);
        } else {
            setNotificarEdicao(false);
            setHorarioEdicao('');
        }
    };

    const handleFecharEdicao = () => {
        setTarefaEmEdicao(null);
        setTextoEdicao('');
        setNotificarEdicao(false);
        setHorarioEdicao('');
    };

    // Salva as alterações feitas na tarefa e reagenda a notificação
    const handleSalvarEdicao = async () => {
        if (!tarefaEmEdicao) return;
        const textoLimpo = textoEdicao.trim();
        if (!textoLimpo) return;

        let horarioFinal: string | undefined = undefined;
        let novoIdNotificacao: string | undefined = tarefaEmEdicao.idNotificacao;

        // Se já existia uma notificação agendada, cancelamos a anterior
        if (tarefaEmEdicao.idNotificacao) {
            await cancelarNotificacao(tarefaEmEdicao.idNotificacao);
            novoIdNotificacao = undefined;
        }

        // Se a opção de notificar estiver ativa, agenda no novo horário
        if (notificarEdicao && horarioEdicao.trim()) {
            horarioFinal = sanitizarHorarioFinal(horarioEdicao);
            const [hStr, mStr] = horarioFinal.split(':');
            const h = parseInt(hStr, 10);
            const m = parseInt(mStr, 10);

            const notifId = await agendarNotificacaoDiaria({
                titulo: 'Sete Ervas 🌿 - Hora de Cuidar!',
                corpo: `Lembrete diário: ${textoLimpo}`,
                hora: h,
                minuto: m,
            });

            if (notifId) {
                novoIdNotificacao = notifId;
            }
        }

        atualizarEPersistirTarefas((prev) =>
            prev.map((t) =>
                t.id === tarefaEmEdicao.id
                    ? {
                          ...t,
                          texto: textoLimpo,
                          horarioNotificacao: horarioFinal,
                          idNotificacao: novoIdNotificacao,
                      }
                    : t
            )
        );

        handleFecharEdicao();
        Keyboard.dismiss();
    };

    // Dispara uma notificação instantânea de teste personalizada
    const handleTestarNotificacao = async (texto: string) => {
        const titulo = 'Sete Ervas 🌿 - Hora de Cuidar!';
        const corpo = `Lembrete de teste: ${texto || 'Regar as plantas'}`;
        const id = await dispararNotificacaoInstantanea(titulo, corpo);
        if (id) {
            Alert.alert(
                'Notificação Disparada! 🔔',
                'Uma notificação personalizada de teste foi enviada para o seu dispositivo.'
            );
        } else {
            Alert.alert(
                'Permissão Necessária',
                'Por favor, autorize as notificações para que o Sete Ervas possa enviar seus lembretes.'
            );
        }
    };

    return (
        <View style={styles.cardContainer}>
            {/* Cabeçalho do Card */}
            <View style={styles.headerRow}>
                <View style={styles.tituloRow}>
                    <Ionicons name="checkbox-outline" size={20} color="#10DE80" />
                    <Text style={styles.titulo}>Tarefas de Cuidados</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.botaoAdicionarHeader}
                    onPress={() => {
                        setMostrarInput((prev) => !prev);
                        if (mostrarInput) {
                            setNotificarAtivo(false);
                            setHorarioNotificacao('');
                        }
                    }}
                >
                    <Feather
                        name={mostrarInput ? 'x' : 'plus'}
                        size={16}
                        color="#10DE80"
                    />
                    <Text style={styles.textoBotaoAdicionar}>
                        {mostrarInput ? 'Fechar' : 'Adicionar tarefa'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Formulário para Inserir Nova Tarefa */}
            {mostrarInput && (
                <View style={styles.formContainer}>
                    {/* Campo de Texto do Nome da Tarefa */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Escreva a nova tarefa..."
                            placeholderTextColor="#5C8274"
                            value={novaTarefa}
                            onChangeText={setNovaTarefa}
                            onSubmitEditing={handleAdicionarTarefa}
                            returnKeyType="done"
                            underlineColorAndroid="transparent"
                            selectionColor="#10DE80"
                        />
                    </View>

                    {/* Linha da Opção Notificar e Botão de Salvar */}
                    <View style={styles.linhaAcoesForm}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                                styles.botaoNotificar,
                                notificarAtivo && styles.botaoNotificarAtivo,
                            ]}
                            onPress={() => setNotificarAtivo((prev) => !prev)}
                        >
                            <Ionicons
                                name={notificarAtivo ? 'notifications' : 'notifications-outline'}
                                size={15}
                                color={notificarAtivo ? '#052014' : '#10DE80'}
                            />
                            <Text
                                style={[
                                    styles.textoBotaoNotificar,
                                    notificarAtivo && styles.textoBotaoNotificarAtivo,
                                ]}
                            >
                                Notificar
                            </Text>
                        </TouchableOpacity>

                        {/* Campo de Horário Numérico com Máscara e Validação */}
                        {notificarAtivo && (
                            <View style={styles.containerInputHora}>
                                <Feather name="clock" size={13} color="#10DE80" />
                                <TextInput
                                    style={styles.inputHora}
                                    placeholder="00:00"
                                    placeholderTextColor="#5C8274"
                                    value={horarioNotificacao}
                                    onChangeText={(t) =>
                                        setHorarioNotificacao(formatarHorario(t, horarioNotificacao))
                                    }
                                    keyboardType="numeric"
                                    maxLength={5}
                                    underlineColorAndroid="transparent"
                                    selectionColor="#10DE80"
                                />
                            </View>
                        )}

                        {notificarAtivo && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.botaoTestarPequeno}
                                onPress={() => handleTestarNotificacao(novaTarefa)}
                            >
                                <Ionicons name="notifications-outline" size={12} color="#10DE80" />
                                <Text style={styles.textoBotaoTestarPequeno}>Testar</Text>
                            </TouchableOpacity>
                        )}

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.botaoSalvar,
                                !novaTarefa.trim() && styles.botaoSalvarDesabilitado,
                            ]}
                            onPress={handleAdicionarTarefa}
                            disabled={!novaTarefa.trim()}
                        >
                            <Feather name="plus" size={18} color="#052014" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Conteúdo com Scroll interno */}
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            >
                {carregando ? (
                    <View style={styles.containerCarregando}>
                        <ActivityIndicator size="small" color="#10DE80" />
                    </View>
                ) : tarefas.length === 0 ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.emptyContainer}
                        onPress={() => setMostrarInput(true)}
                    >
                        <View style={styles.iconeVazioWrapper}>
                            <Feather name="plus-circle" size={32} color="#10DE80" />
                        </View>
                        <Text style={styles.mensagemAdicionar}>Adicionar tarefa</Text>
                        <Text style={styles.subtituloVazio}>
                            Toque aqui para registrar sua primeira tarefa de hoje.
                        </Text>
                    </TouchableOpacity>
                ) : (
                    tarefas.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.itemTarefa,
                                item.concluida && styles.itemTarefaConcluida,
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.areaCheckbox}
                                onPress={() => handleAlternarTarefa(item.id)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        item.concluida && styles.checkboxConcluido,
                                    ]}
                                >
                                    {item.concluida && (
                                        <Ionicons
                                            name="checkmark"
                                            size={14}
                                            color="#052014"
                                        />
                                    )}
                                </View>

                                <View style={styles.conteudoTextoTarefa}>
                                    <Text
                                        style={[
                                            styles.textoTarefa,
                                            item.concluida && styles.textoTarefaConcluida,
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {item.texto}
                                    </Text>

                                    {item.horarioNotificacao && (
                                        <View style={styles.badgeNotificacao}>
                                            <Ionicons
                                                name="notifications"
                                                size={11}
                                                color={item.concluida ? '#5C8274' : '#10DE80'}
                                            />
                                            <Text
                                                style={[
                                                    styles.textoBadgeNotificacao,
                                                    item.concluida && styles.textoBadgeNotificacaoConcluida,
                                                ]}
                                            >
                                                {item.horarioNotificacao}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* Ações da Tarefa: Alterar (3 pontos) e Excluir */}
                            <View style={styles.acoesTarefa}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.botaoAcao}
                                    onPress={() => handleAbrirEdicao(item)}
                                >
                                    <Feather name="more-vertical" size={17} color="#10DE80" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.botaoAcao}
                                    onPress={() => handleRemoverTarefa(item.id)}
                                >
                                    <Feather name="trash-2" size={16} color="#7EA293" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Modal para Alterar / Editar Tarefa via 3 Pontos */}
            <Modal
                visible={tarefaEmEdicao !== null}
                animationType="fade"
                transparent={true}
                onRequestClose={handleFecharEdicao}
            >
                <View style={styles.fundoModal}>
                    <View style={styles.conteudoModal}>
                        {/* Topo do Modal */}
                        <View style={styles.topoModal}>
                            <View style={styles.tituloModalContainer}>
                                <Ionicons name="create-outline" size={20} color="#10DE80" />
                                <Text style={styles.tituloModal}>Alterar Tarefa</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.botaoFecharModal}
                                onPress={handleFecharEdicao}
                            >
                                <Feather name="x" size={20} color="#8A9A93" />
                            </TouchableOpacity>
                        </View>

                        {/* Campo de Texto para Alterar Nome da Tarefa */}
                        <Text style={styles.labelCampoModal}>Nome da tarefa</Text>
                        <View style={styles.inputContainerModal}>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="Nome da tarefa..."
                                placeholderTextColor="#5C8274"
                                value={textoEdicao}
                                onChangeText={setTextoEdicao}
                                underlineColorAndroid="transparent"
                                selectionColor="#10DE80"
                            />
                        </View>

                        {/* Opção de Notificar e Horário */}
                        <Text style={styles.labelCampoModal}>Horário de lembrete</Text>
                        <View style={styles.linhaAcoesForm}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[
                                    styles.botaoNotificar,
                                    notificarEdicao && styles.botaoNotificarAtivo,
                                ]}
                                onPress={() => setNotificarEdicao((prev) => !prev)}
                            >
                                <Ionicons
                                    name={notificarEdicao ? 'notifications' : 'notifications-outline'}
                                    size={15}
                                    color={notificarEdicao ? '#052014' : '#10DE80'}
                                />
                                <Text
                                    style={[
                                        styles.textoBotaoNotificar,
                                        notificarEdicao && styles.textoBotaoNotificarAtivo,
                                    ]}
                                >
                                    Notificar
                                </Text>
                            </TouchableOpacity>

                            {notificarEdicao && (
                                <View style={styles.containerInputHora}>
                                    <Feather name="clock" size={13} color="#10DE80" />
                                    <TextInput
                                        style={styles.inputHora}
                                        placeholder="00:00"
                                        placeholderTextColor="#5C8274"
                                        value={horarioEdicao}
                                        onChangeText={(t) =>
                                            setHorarioEdicao(formatarHorario(t, horarioEdicao))
                                        }
                                        keyboardType="numeric"
                                        maxLength={5}
                                        underlineColorAndroid="transparent"
                                        selectionColor="#10DE80"
                                    />
                                </View>
                            )}
                        </View>

                        {/* Botão de Disparo Instantâneo para Teste */}
                        {notificarEdicao && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.botaoTestarNotificacao}
                                onPress={() => handleTestarNotificacao(textoEdicao)}
                            >
                                <Ionicons name="notifications-outline" size={15} color="#10DE80" />
                                <Text style={styles.textoBotaoTestarNotificacao}>
                                    Testar disparo de notificação agora
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Rodapé do Modal com Botões de Cancelar e Salvar */}
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
                                    !textoEdicao.trim() && styles.botaoSalvarModalDesabilitado,
                                ]}
                                onPress={handleSalvarEdicao}
                                disabled={!textoEdicao.trim()}
                            >
                                <Text style={styles.textoBotaoSalvarModal}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CardTarefas;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#0B2B22',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 18,
        marginTop: 6,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    tituloRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titulo: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    botaoAdicionarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#072019',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#134233',
        gap: 4,
    },
    textoBotaoAdicionar: {
        color: '#10DE80',
        fontSize: 12,
        fontWeight: '600',
    },
    formContainer: {
        backgroundColor: '#061C15',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 10,
        marginBottom: 12,
        gap: 8,
    },
    inputContainer: {
        backgroundColor: '#072019',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#134233',
    },
    input: {
        color: '#FFFFFF',
        fontSize: 14,
        paddingVertical: 6,
        borderWidth: 0,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    linhaAcoesForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    botaoNotificar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#072019',
        borderWidth: 1,
        borderColor: '#134233',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    botaoNotificarAtivo: {
        backgroundColor: '#10DE80',
        borderColor: '#10DE80',
    },
    textoBotaoNotificar: {
        color: '#10DE80',
        fontSize: 12,
        fontWeight: '600',
    },
    textoBotaoNotificarAtivo: {
        color: '#052014',
        fontWeight: '700',
    },
    containerInputHora: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#072019',
        borderWidth: 1,
        borderColor: '#134233',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 6,
    },
    inputHora: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        minWidth: 46,
        textAlign: 'center',
        paddingVertical: 2,
        paddingHorizontal: 0,
        borderWidth: 0,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    botaoSalvar: {
        backgroundColor: '#10DE80',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoSalvarDesabilitado: {
        opacity: 0.35,
    },
    scrollArea: {
        maxHeight: 280,
    },
    scrollContent: {
        paddingVertical: 2,
        gap: 10,
    },
    containerCarregando: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 28,
        paddingHorizontal: 16,
        backgroundColor: '#072019',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#134233',
        borderStyle: 'dashed',
    },
    iconeVazioWrapper: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#0B2B22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    mensagemAdicionar: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtituloVazio: {
        color: '#7EA293',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 17,
    },
    itemTarefa: {
        backgroundColor: '#072019',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#134233',
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTarefaConcluida: {
        backgroundColor: '#051813',
        borderColor: '#0D291F',
        opacity: 0.65,
    },
    areaCheckbox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#235D4A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxConcluido: {
        backgroundColor: '#10DE80',
        borderColor: '#10DE80',
    },
    conteudoTextoTarefa: {
        flex: 1,
    },
    textoTarefa: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    textoTarefaConcluida: {
        color: '#7EA293',
        textDecorationLine: 'line-through',
    },
    badgeNotificacao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A2A20',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
        gap: 4,
    },
    textoBadgeNotificacao: {
        color: '#10DE80',
        fontSize: 11,
        fontWeight: '600',
    },
    textoBadgeNotificacaoConcluida: {
        color: '#5C8274',
    },
    acoesTarefa: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    botaoAcao: {
        padding: 6,
    },
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    conteudoModal: {
        backgroundColor: '#072019',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 20,
        width: '100%',
        maxWidth: 420,
    },
    topoModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 4,
    },
    inputContainerModal: {
        backgroundColor: '#051813',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#134233',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 12,
    },
    inputModal: {
        color: '#FFFFFF',
        fontSize: 14,
        paddingVertical: 6,
        borderWidth: 0,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    rodapeModal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
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
    botaoTestarPequeno: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#072019',
        borderWidth: 1,
        borderColor: '#134233',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    textoBotaoTestarPequeno: {
        color: '#10DE80',
        fontSize: 11,
        fontWeight: '600',
    },
    botaoTestarNotificacao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#051813',
        borderWidth: 1,
        borderColor: '#134233',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginTop: 12,
        gap: 6,
    },
    textoBotaoTestarNotificacao: {
        color: '#10DE80',
        fontSize: 12,
        fontWeight: '600',
    },
});

import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function Termos() {
    const [nome, setNome] = useState('');
    const [termosAceitos, setTermosAceitos] = useState(false);
    const handleCadastrar = () => {
        
        // Avalia a lógica dos termos de uso
        if (termosAceitos) {
            if (nome.trim() === '') {
                Alert.alert('Atenção', 'Por favor, digite seu nome antes de cadastrar.');
                window.alert('Por favor, digite seu nome antes de cadastrar.');
            } else {
                Alert.alert('Sucesso', `Cadastro realizado com sucesso!\nBem-vindo(a), ${nome}!`);
                window.alert(`Cadastro realizado com sucesso!\nBem-vindo(a), ${nome}!`);
            }
        } else {
            Alert.alert('Erro', 'Você precisa aceitar os termos de uso para continuar.');
            window.alert('Você precisa aceitar os termos de uso para continuar.');
        }
    };
    return (
        <View style={styles.switchContainer}>
            <Text style={styles.label}>Aceito os termos  </Text>
            <Switch
                value={termosAceitos}
                onValueChange={setTermosAceitos} // Atualiza o estado 'termosAceitos' (true/false)
                thumbColor={termosAceitos ? '#023505' : '#636363'}
                trackColor={{ false: '#fafafa', true: '#C4C9F3' }}
            />
        </View>
    );

}
const styles = StyleSheet.create({
    input: {
        borderWidth: 12,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#FAFAFA',
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:19,
        marginBottom: 24,

    },
    label: {
        fontSize: 16,
        color: '#444444',
    },

});
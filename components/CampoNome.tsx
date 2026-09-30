import { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

export function CampoNome() {
    const [nome, SetNome] = useState('');
    const [campoAtivo, setCampoAtivo] = useState(false);
    console.log(nome);

    const handleFocus = () => {
        setCampoAtivo(true);
        console.log('Campo selecionado');
    };
    const handleBlur = () => {
        setCampoAtivo(false);
        console.log('Saiu do campo');
    };
    const handleSubmit = () => {
        window.alert('Enviado');
        console.log('Enter apertado,Formulário enviado!');
    };

    return (

        <TextInput style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={SetNome}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 52,
        textAlign: "center",
        borderColor: '#D5DED9',
        borderRadius: 14,
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        backgroundColor: '#FAFCFB',
    },
});
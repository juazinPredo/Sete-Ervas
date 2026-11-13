import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export interface CampoNomeProps extends TextInputProps {
    onNomeChange?: (texto: string) => void;
}

export function CampoNome({ onNomeChange, ...rest }: CampoNomeProps) {
    const [nome, setNome] = useState('');
    const [campoAtivo, setCampoAtivo] = useState(false);

    const handleFocus = () => {
        setCampoAtivo(true);
    };

    const handleBlur = () => {
        setCampoAtivo(false);
    };

    const handleChangeText = (texto: string) => {
        setNome(texto);
        if (onNomeChange) {
            onNomeChange(texto);
        }
    };

    return (
        <TextInput
            style={[styles.input, campoAtivo && styles.inputAtivo]}
            placeholder="Nome"
            placeholderTextColor="#5C8274"
            selectionColor="#10DE80"
            underlineColorAndroid="transparent"
            value={nome}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
        />
    );
}

export default CampoNome;

const styles = StyleSheet.create({
    input: {
        height: 50,
        textAlign: 'left',
        paddingHorizontal: 14,
        borderColor: '#134233',
        borderWidth: 1,
        borderRadius: 14,
        fontSize: 15,
        color: '#FFFFFF',
        marginBottom: 14,
        backgroundColor: '#072019',
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    inputAtivo: {
        borderColor: '#10DE80',
    },
});
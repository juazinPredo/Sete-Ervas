import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export interface BotaoCadastroProps {
    onPress?: () => void;
    titulo?: string;
}

export function BotaoCadastro({ onPress, titulo = 'Registrar' }: BotaoCadastroProps) {
    const [isPressed, setIsPressed] = useState(false);
    const router = useRouter();

    const handlePressIn = () => {
        setIsPressed(true);
        if (onPress) {
            onPress();
        } else {
            Alert.alert('Sucesso', 'Cadastro Realizado!');
            router.push('/Login');
        }
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <View>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.botao, isPressed && styles.botaoPressionado]}
            >
                <Text style={styles.textoBotao}>{titulo}</Text> 
            </Pressable>
        </View>
    );
}

export default BotaoCadastro;

const styles = StyleSheet.create({
    botao: {
        backgroundColor: '#10DE80',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        height: 50,
    },
    botaoPressionado: {
        backgroundColor: '#0EB86B',
        opacity: 0.9,
    },
    textoBotao: {
        color: '#052014',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export interface BotaoLongPressProps {
    titulo?: string;
    onLongPress?: () => void;
}

export function BotaoLongPress({ titulo = 'Pressione e Segure', onLongPress }: BotaoLongPressProps) {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handleLongPress = () => {
        if (onLongPress) {
            onLongPress();
        } else {
            Alert.alert('Info', 'Você pressionou o botão por tempo suficiente!');
            console.log('Botao longo acionado');
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLongPress={handleLongPress}
                style={[
                    styles.button,
                    isPressed ? styles.buttonPressed : styles.buttonNormal,
                ]}
            >
                <Text style={styles.buttonText}>{titulo}</Text>
            </Pressable>
        </View>
    );
}

export default BotaoLongPress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 1.9,
        marginBottom: 1.9,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonNormal: {
        backgroundColor: '#10DE80',
    },
    buttonPressed: {
        backgroundColor: '#0db368',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

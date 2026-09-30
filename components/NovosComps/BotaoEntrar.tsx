import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export function BotaoEntrar() {
    const [isPressed, setIsPressed] = useState(false);
    
    const handlePressIn = () => {
        Alert.alert('Login Realizado com sucesso!');
        window.alert('Login Realizado com sucesso!');
    };
    const handlePressOut = () => {setIsPressed(false); };

    return(
        <View>
            <Pressable onPressIn = {handlePressIn} onPressOut={handlePressOut} 
            style={[styles.botao, isPressed? styles.botao : styles.botao,]}>
                <Text style={styles.textoBotao}>Entrar</Text>
            </Pressable>
        </View>
    );

}


const styles = StyleSheet.create({
    botao: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        height: 50,
    },
    textoBotao: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export function BotaoCadastro() {
    const [isPressed, setIsPressed] = useState(false);
    const router = useRouter();

    const handlePressIn = () => {
        Alert.alert('Cadastro Realizado!');
        window.alert('Cadastro Realizado!');
        router.push("/Login");
    };
    const handlePressOut = () => { setIsPressed(false); };

    return (
        <View>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.botao, isPressed ? styles.botao : styles.botao,]}>
                <Text style={styles.textoBotao}>Registrar</Text> 
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
    },botao1:{
        backgroundColor: '#04468d',
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

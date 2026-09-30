import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { BotaoEntrar } from './../../components/NovosComps/BotaoEntrar';
import Termos from "./../../components/NovosComps/Termos";
import { CardLogin } from './Card';
export function Entrar() {

    const lidarComLogin = () => {
        Alert.alert("Sucesso", "Login Feito com Sucesso!");
    };

    return (
        <View style={styles.container}>
            <CardLogin>
                <Text style={styles.texto}>Login</Text>
                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999" />
                <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999" secureTextEntry />
                <BotaoEntrar/>
                <Termos/>
            </CardLogin>
        </View>

    );
}

const styles = StyleSheet.create({
input: {
        padding: 15,
        height: 50, // Aumentei um pouco a altura (35 é pequeno para tocar com o dedo no celular)
        borderColor: 'rgb(5, 5, 5)',
        borderWidth: 1,
        borderRadius: 14,
        fontSize: 16,
        color: '#020202',
        marginBottom: 10,
    },
    texto:{
        fontSize:22,
        fontWeight: 'bold',
        textAlign:"center",
        marginTop:5,
        marginBottom:15,
    },
    container: {
        flex: 1, // Faz a View ocupar a altura inteira da tela
        justifyContent: 'center', // Centraliza o Card na vertical (meio da tela)
        alignItems: 'center', // Centraliza o Card na horizontal
        marginBottom:190
    },
})
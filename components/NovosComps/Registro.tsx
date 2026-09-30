import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BotaoCadastro } from './../../components/NovosComps/BotaoCadastro';
import Termos from "./../../components/NovosComps/Termos";
import { CardLogin } from './Card';


export default function Registro({}) {
     const router = useRouter();
    const lidarComLogin = () => {
        Alert.alert("Cadastro Feito com Sucesso!");
    };

    const [isPassword, setIsPassword] = useState(true)
    return (
        <View style={styles.container}>
            <CardLogin>
                <Text style={styles.texto}>Cadastro</Text>
                <Text style={styles.texto1}>Nome Completo</Text>
                <TextInput style={styles.input} placeholder="Digite seu Nome" placeholderTextColor="#999" />
                <Text style={styles.texto1}>E-mail</Text>
                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999" />
                <Text style={styles.texto1}>Senha</Text>
                <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999" secureTextEntry={isPassword}/>   
                <Text style={styles.texto1}>Telefone</Text>
                <TextInput style={styles.input} placeholder="(00)-00000-0000" placeholderTextColor="#999"/>   
                <TouchableOpacity onPress={() => setIsPassword(!isPassword)}>
                    {isPassword == false ? <FontAwesome5 name="eye" size={24} color="black" />: <FontAwesome5 name="eye-slash" size={24} color="black" />}
                </TouchableOpacity>
                <BotaoCadastro />
                <Termos />
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
    texto: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 5,
        marginBottom: 15,
    },
    container: {
        flex: 1, // Faz a View ocupar a altura inteira da tela
        justifyContent: 'center', // Centraliza o Card na vertical (meio da tela)
        alignItems: 'center', // Centraliza o Card na horizontal
        marginBottom: 110
    },
    textLink: {
        color: '#0066CC',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
        texto1: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: "left",
        marginTop: 5,
        marginBottom: 15,
    },
})
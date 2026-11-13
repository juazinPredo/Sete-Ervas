import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BotaoEntrar } from '@/components/ui/BotaoEntrar';
import { CardLogin } from '@/components/ui/Card';
import { CompLink } from '@/components/ui/CompLink';
import { Termos } from './Termos';

export function Entrar() {
    const router = useRouter();
    const [isPassword, setIsPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <View style={styles.container}>
            <CardLogin>
                <Text style={styles.texto}>Login</Text>
                
                <Text style={styles.rotulo}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#5C8274"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                    selectionColor="#10DE80"
                />

                <Text style={styles.rotulo}>Senha</Text>
                <View style={styles.containerSenha}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#5C8274"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={isPassword}
                        underlineColorAndroid="transparent"
                        selectionColor="#10DE80"
                    />
                    <TouchableOpacity 
                        onPress={() => setIsPassword(!isPassword)} 
                        style={styles.iconeSenha}
                        activeOpacity={0.7}
                    >
                        <FontAwesome5 
                            name={isPassword ? 'eye-slash' : 'eye'} 
                            size={16} 
                            color="#10DE80" 
                        />
                    </TouchableOpacity>
                </View>

                <BotaoEntrar />
                <Termos />

                <CompLink onPress={() => router.push('/cadastro')}>
                    Não tem uma conta? Cadastre-se
                </CompLink>
            </CardLogin>
        </View>
    );
}

export default Entrar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    texto: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    rotulo: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8A9A93',
        marginBottom: 6,
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        paddingHorizontal: 14,
        height: 50,
        borderRadius: 14,
        fontSize: 15,
        color: '#080808',
        marginBottom: 10,
        backgroundColor: '#fdfdfd',
    },
    containerSenha: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: '#134233',
        borderRadius: 14,
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        marginBottom: 10,
    },
    inputSenha: {
        flex: 1,
        fontSize: 15,
        color: '#0e0d0d',
        outlineWidth: 0,
        outlineColor: 'transparent',
        borderWidth: 0,
    },
    iconeSenha: {
        padding: 6,
        marginLeft: 6,
    },
});

import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
const imageBack = './../../assets/BackLogin.jpg';
import Registro from './../../components/NovosComps/Registro';

export default function Cadastro() {
    const { width } = useWindowDimensions();
    const isTable = width >= 768; // Breackpoint simples

    return (
        <View style={[styles.container, isTable && styles.containerTablet]}>
            <ImageBackground
                source={require(imageBack)}
                style={styles.imagemFundo}>
                <Registro />
            </ImageBackground>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#05110E',
        // backgroundColor: '#FFFF' 
    },
    text: {
        color: '#FFF',
        fontSize: 18,

    },
    imagemFundo: {
        flex: 1,
        resizeMode: "cover",
        width: '100%',
        paddingTop: 100,
    },
    containerTablet: {
    },
});

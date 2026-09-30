import { ImageBackground, StyleSheet, useWindowDimensions, View } from 'react-native';
const imageBack = '../../../assets/BackLogin.jpg';
import { Entrar } from '../../../components/NovosComps/Entrar';




export default function Login() {
  const { width } = useWindowDimensions();
  const isTable = width >= 768; // Breackpoint simples

  return (
    <View style={[styles.container, isTable && styles.containerTablet]} >
      <ImageBackground
        source={require(imageBack)}
        style={styles.imagemFundo}>
          <Entrar/>
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
    paddingTop:100 ,
  },
  containerTablet: {
  },
});

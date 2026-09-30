import { Button } from "react-native";
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export function BotaoCadastro() {
   const [isPressed, setIsPressed] = useState(false);
   const handlePressIn = () => {setIsPressed(true)};
   const handlePressOut = () => { setIsPressed(false); };
   const handleLongPress = () => { 
      Alert.alert(' pressionou o botão por tempo suficiente!'); 
      window.alert(' botão por tempo suficiente!');
      console.log('Botao longo');
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
            <Text style={styles.buttonText}>Pressione e Segure</Text>
         </Pressable>
      </View>
   );
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   button: {
      marginTop:1.9,
      marginBottom:1.9,
      paddingVertical: 16,
      paddingHorizontal:16,
      borderRadius:18,
      elevation: 3, // Sombra no Android
      shadowColor: '#000', // Sombra no iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
   },
   buttonNormal: {
      backgroundColor: '#10DE80', // Azul (Estado Inicial)
   },
   buttonPressed: {
      backgroundColor: '#10DE80', // Verde (Em Pressionamento)
   },
   buttonText: {
       color: '#FFFFFF',
       fontSize: 16,
       fontWeight: 'bold',
       textAlign: 'center',
   },
});

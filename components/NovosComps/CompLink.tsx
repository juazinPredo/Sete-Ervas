import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';


export function CompLink({ children, onPress }) {
    return (
        <Pressable onPress ={onPress}>
            <Text style={styles.link}>
                {children}    
            </Text>
        </Pressable>
);
}
const styles = StyleSheet.create({
    link:{
        color:'#0066CC',
        textDecorationLine:'underline',
    },

})
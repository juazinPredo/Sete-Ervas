import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';


export function CardLogin({ children }: { children: React.ReactNode }) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    return (
    <View style={[styles.card,{ width: isMobile ? '90%' : 400 }]}>
            {children}
        </View>
    );
}

const styles =StyleSheet.create({
        card: {
        backgroundColor: '#d3d3d3',
        borderRadius: 15,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 100,
        shadowRadius: 15,
       
    },
});

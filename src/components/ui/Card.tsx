import React from 'react';
import { StyleSheet, View, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';

export interface CardLoginProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardLogin({ children, style }: CardLoginProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={[styles.card, { width: isMobile ? '90%' : 400 }, style]}>
            {children}
        </View>
    );
}

export default CardLogin;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0B2B22',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#134233',
        padding: 26,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
    },
});

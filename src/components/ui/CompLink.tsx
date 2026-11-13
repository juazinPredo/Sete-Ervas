import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, TextStyle, StyleProp } from 'react-native';

export interface CompLinkProps {
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<TextStyle>;
}

export function CompLink({ children, onPress, style }: CompLinkProps) {
    return (
        <Pressable onPress={onPress}>
            <Text style={[styles.link, style]}>
                {children}    
            </Text>
        </Pressable>
    );
}

export default CompLink;

const styles = StyleSheet.create({
    link: {
        color: '#10DE80',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 14,
        textDecorationLine: 'none',
    },
});

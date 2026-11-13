import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export interface TermosProps {
    aoMudarTermos?: (aceitou: boolean) => void;
    valorInicial?: boolean;
}

export function Termos({ aoMudarTermos, valorInicial = false }: TermosProps) {
    const [termosAceitos, setTermosAceitos] = useState(valorInicial);

    const handleChange = (valor: boolean) => {
        setTermosAceitos(valor);
        if (aoMudarTermos) {
            aoMudarTermos(valor);
        }
    };

    return (
        <View style={styles.switchContainer}>
            <Text style={styles.label}>Aceito os termos</Text>
            <Switch
                value={termosAceitos}
                onValueChange={handleChange}
                thumbColor={termosAceitos ? '#10DE80' : '#5C8274'}
                trackColor={{ false: '#072019', true: '#134233' }}
            />
        </View>
    );
}

export default Termos;

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#8A9A93',
        fontWeight: '500',
    },
});

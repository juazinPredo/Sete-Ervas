 import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                // Esconde o cabeçalho do topo
                headerShown: false,

                // Estilo geral dos rótulos/textos //

                // Cor do texto quando ativo 
                tabBarActiveTintColor: '#f7f2f2',

                // Cor dos itens inativos
                tabBarInactiveTintColor: '#05614B',

                // Estilo da barra principal que flutua no fundo
                tabBarStyle: {
                    // Fundo escuro da barra
                    backgroundColor: '#0A1714',
                    // Cantos arredondados externos 
                    borderRadius: 35,
                    height: 75,
                    position: 'absolute',
                    bottom: 40,
                    left: 16,
                    right: 16,

                    // Remove linha de borda padrão
                    borderTopWidth: 0,
                    // Remove sombra no Android          
                    elevation: 0,
                    // overflow: 'hidden',
                },
            }}
        >
            {/* 1. ABA INÍCIO */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="home" size={25} color={focused ? '#ffffff' : '#05614B'} />
                    ),
                }}
            />

            {/* 2. ABA EXPLORAR */}
            <Tabs.Screen
                name="explorar"
                options={{
                    title: 'Explorar',
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="search" size={25} color={focused ? '#fff' : '#05614B'} />
                    ),
                }}
            />

            {/* 3. ABA COLEÇÃO */}
            <Tabs.Screen
                name="colecao"
                options={{
                    title: 'Coleção',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name="leaf" size={24} color={focused ? '#ffffff' : '#05614B'} />
                    ),
                }}
            />

            {/* 4. ABA PERFIL */}
            <Tabs.Screen
                name="Login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="user" size={25} color={focused ? '#fff' : '#05614B'} />
                    ),
                }}
            />
        </Tabs>
    );
}


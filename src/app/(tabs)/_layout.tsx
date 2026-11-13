import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerTitleAlign: 'center',

                // Cor do texto quando ativo 
                tabBarActiveTintColor: '#f7f2f2',

                // Cor dos itens inativos
                tabBarInactiveTintColor: '#05614B',

                // Estilo da barra principal que flutua no fundo
                tabBarStyle: {
                    backgroundColor: '#0A1714',
                    borderRadius: 35,
                    height: 72,
                    position: 'absolute',
                    bottom: 50,
                    left: 16,
                    right: 16,
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
        >
            {/* 1. ABA INÍCIO */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ focused }) => (
                        <Feather name="home" size={25} color={focused ? '#ffffff' : '#05614B'} />
                    ),
                }}
            />

            {/* 2. ABA EXPLORAR */}
            <Tabs.Screen
                name="explorar"
                options={{
                    title: 'Explorar',
                    tabBarIcon: ({ focused }) => (
                        <Feather name="search" size={25} color={focused ? '#fff' : '#05614B'} />
                    ),
                }}
            />

            {/* 3. ABA COLEÇÃO */}
            <Tabs.Screen
                name="colecao"
                options={{
                    title: 'Coleção',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="leaf" size={25} color={focused ? '#ffffff' : '#05614B'} />
                    ),
                }}
            />

            {/* 4. ABA PERFIL */}
            <Tabs.Screen
                name="Login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ focused }) => (
                        <Feather name="user" size={25} color={focused ? '#fff' : '#05614B'} />
                    ),
                }}
            />
        </Tabs>
    );
}

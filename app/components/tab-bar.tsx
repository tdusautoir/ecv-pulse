import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ArrowRightIcon, ChartColumnIcon, CircleQuestionMarkIcon, HouseIcon, LogOut, LucideIcon, SendIcon } from 'lucide-react-native';
import { Small } from './ui/typography';
import { cn } from '@/lib/utils';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';

const useRoute = (name: string): { icon: LucideIcon } => {
    switch (name) {
        case 'index':
            return { icon: HouseIcon }

        case 'payment':
            return { icon: SendIcon }

        case 'budget': {
            return { icon: ChartColumnIcon }
        }

        default:
            return { icon: CircleQuestionMarkIcon }
    }
}

export default function TabBar({ state, navigation, descriptors }: BottomTabBarProps) {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <View className='flex flex-row items-center justify-around bg-background rounded-t-xl' style={{
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: -12,
            },
            shadowOpacity: 0.10,
            shadowRadius: 12,
        }}>
            {state.routes.map((route, index) => {
                const routeInfo = useRoute(route.name);

                if (route.key === 'payment-modal') {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => router.push('/(authenticated)/modals/payment')}
                            className={cn('flex flex-col items-center gap-1 m-2 rounded-xl p-3')}
                            style={{ flex: 1 }}>
                            <routeInfo.icon size={22} color={'#384252'} />
                            <Small>Payer</Small>
                        </TouchableOpacity>
                    );
                }


                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        className={cn('flex flex-col items-center gap-2 m-2 rounded-xl p-3', isFocused && 'bg-secondary/50')}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}>
                        <routeInfo.icon size={20} color={isFocused ? colors['primary'] : '#384252'} />
                        <Small className={cn(isFocused && 'text-primary')}>{label.toString()}</Small>
                    </TouchableOpacity>
                );
            })}
            <TouchableOpacity
                onPress={() => router.push('/(authenticated)/modals/payment')}
                className={cn('flex flex-col items-center gap-2 m-2 rounded-xl p-3')}
                style={{ flex: 1 }}>
                <SendIcon size={20} color={'#384252'} />
                <Small>Payer</Small>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => logout()}
                className={cn('flex flex-col items-center gap-1 m-2 rounded-xl p-3')}
                style={{ flex: 1 }}>
                <LogOut size={24} color={colors['destructive']} />
            </TouchableOpacity>
        </View>
    );
}
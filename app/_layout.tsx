import { Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import React from 'react';

export default function Layout() {
    const navigation = useNavigation()
    // navigation.dispatch()
    return (
        <>
            <StatusBar hidden />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}
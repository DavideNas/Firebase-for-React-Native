import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

interface HeaderBarProps {
    title?: string;
    logOutHandler: any;
}

export default function HeaderBar ({title, logOutHandler}:HeaderBarProps) {
    const { HeaderContainer, HeaderText } = styles;
    return (
        <View style={HeaderContainer}>
            <Icon.Menu size="$3" color="#333" />
            <Text style={HeaderText}>{title}</Text>
            <TouchableOpacity onPress={() => {
                    logOutHandler();
                }}>
               <Icon.LogOut size="$3" color="#333" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    HeaderContainer:{
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    HeaderText: {
        fontSize: 20,
        color: '#333',
    },
});

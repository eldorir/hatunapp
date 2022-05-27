import React, { useState, useEffect } from 'react';

// Import all required component
import {

    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    ScrollView,
    ImageBackground,
    BackHandler,
    TouchableOpacity,
    Button,
    Image,

} from 'react-native';

import Contacts2 from 'react-native-contacts';
import ListItem from './ListItem';
import background from './bg5.png'


const Blessings = (props) => {




    const onpress=()=>{
        props.setText(props.text)
        props.setShowMessagesSelect(false)
    }
    

    return (


            <TouchableOpacity style={styles.btn} onPress={onpress}>
                <Image style= {styles.bird} source={require('./bird.png')} />

                <Text style={styles.btnText}>{props.text}</Text>
                <Image style= {styles.btrfly} source={require('./butterfly.png')} />

            </TouchableOpacity>
    );
};
export default Blessings;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
    },
    btrfly: {
        alignItems:'flex-start',
        justifyContent: "flex-start",
        marginLeft:250
    },
    bird: {
        alignItems:'flex-start',
        marginRight:250,
        
        justifyContent: "flex-end"
    },
    btn: {
        marginTop: 40,
        backgroundColor: 'rgba(247, 241, 235, 0.8)',
        height: 250,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    image: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: "center"
      },
    btnText: {
        color: "#A8A099",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',

    },
});

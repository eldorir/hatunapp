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
  BackHandler,
  ImageBackground,
  Button,
    
} from 'react-native';

import Contacts2 from 'react-native-contacts';
import ListItem from './ListItem';
import background from './bg5.png'


const Notes = (props) => {


  useEffect(() => {
    const backAction = () => {
      props.setShowContacts(false)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);




  return (
    <SafeAreaView style={styles.container}>
    <ImageBackground source={background} resizeMode="cover" style={styles.image}>

      </ImageBackground>
    </SafeAreaView>
  );
};
export default Notes;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center"
  },
});

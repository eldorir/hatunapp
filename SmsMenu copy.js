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
    TouchableOpacity,
    Alert,
    PermissionsAndroid,

} from 'react-native';

import Contacts2 from 'react-native-contacts';
import ListItem from './ListItem';
import background from './bg10.png'
import Blessings from './Blessings'
import SmsAndroid from 'react-native-get-sms-android';
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'

const SmsMenu = (props) => {
    const [inviteList, setInviteList] = useState({})

    useEffect(() => {
        const db = getDatabase();
        const invites = ref(db, '0/invites/');
        onValue(invites, (snapshot) => {
            setInviteList(snapshot.val())
            
            console.log(Object.values(snapshot.val())[0].phoneNum+'snapshot val')
            console.log(Object.values(inviteList)[0]+'invite list')
        })

    }, [])


    const alert = () => {
        // Alert.alert(
        //     "שים לב!",
        //     "שלח את הסמסים רק כאשר רשימת המוזמנים מוכנה (כולל המוזמנים של ההורים!)",
        //     [
        //         {
        //             text: "חזור להכנת רשימה",
        //             onPress: () => props.setOpenSendSmsMenu(false),
        //             style: "cancel"
        //         },
        //         { text: "שלח סמסים", onPress: () => sendSmssNow }
        //     ]
        // );

        sendSmssNow()
    }

    const sendSmssNow = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                {
                    title: "אנא אשרו גישה לסמסים",
                    message: "לחצו על OK",
                    buttonNeutral: "שאל מאוחר יותר",
                    buttonNegative: "בטל",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                let i = 0
                let phoneNums = []
                Object.keys(inviteList).forEach(function (key) {

                    phoneNums[i] = key
                    i = i + 1
                });
                console.log(phoneNums);


                
                let phoneNumbers = {
                    "addressList": phoneNums
                };
                console.log(phoneNumbers, " message is: " + text)
                SmsAndroid.autoSend(
                    JSON.stringify(phoneNumbers),
                    text,
                    (fail) => {
                        console.log('Failed with this error: ' + fail);
                    },
                    (success) => {
                        console.log('SMS sent successfully');
                    },
                )

            } else {
                console.log("SENDSMS permission denied");
            }
        } catch (err) {
            console.warn(err);
        }


    }


    useEffect(() => {
        const backAction = () => {
            props.setOpenSendSmsMenu(false)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);




    const [text, setText] = useState('')

    const [texts, setTexts] = useState(['אנו נרגשים להזמינכם\n לבר המצווה של .\n לאישור הגעתכם אנא ציינו את מספר האורחים הצפויים להגיע.\nבמידה ואינכם יכולים להגיע שלחו את הספרה 0',
        'שלום לכל האורחים תודה שהגעתם'])
    const onpress = () => {
        setText()
    }


    return (
        <ImageBackground source={background} resizeMode="cover" style={styles.image}>

            <View style={styles.container}>
                <ScrollView>
                    {texts.map((item, index) =>
                        <Blessings
                            text={item}
                            setText={setText}
                            key={index}
                        />
                    )}
                </ScrollView>
                <Text style={styles.btnText} >ערוך הודעה:</Text>
                <TextInput
                    onChangeText={text => setText(text)}
                    style={styles.textInputText}
                    multiline={true}
                    editable
                    maxLength={155}
                    value={text}
                />

                <TouchableOpacity style={styles.sendSmsBtn} onPress={alert}>
                    <Text style={styles.btnText} >שלח סמסים</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>


    );
};
export default SmsMenu;

const styles = StyleSheet.create({
    btn: {
        marginTop: 40,
        backgroundColor: 'rgba(256, 256, 256, 0.6)',
        height: 200,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },

    btnText: {
        color: "#d4ab83",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',

    },
    textInputText: {
        color: "#A8A099",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(256, 256, 256, 0.9)',
        borderRadius: 15,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    image: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: "center"
    },
    sendSmsBtn: {
        marginTop: 40,
        backgroundColor: 'rgba(256, 256, 256, 0.9)',
        height: 45,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
});

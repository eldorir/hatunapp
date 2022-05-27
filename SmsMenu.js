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
    Modal,
    Pressable,

} from 'react-native';

import background from './bg10.png'
import Blessings from './Blessings'
import SmsAndroid from 'react-native-get-sms-android';
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'
import RadioButtonRN from 'radio-buttons-react-native';
// import * as InAppPurchases from 'expo-in-app-purchases';



const SmsMenu = (props) => {
    const [inviteList, setInviteList] = useState({})
    const [fullInviteList, setFullInviteList] = useState({})
    const [maximumInvites, setMaximumInvites] = useState(0)
    const [showMessagesSelect, setShowMessagesSelect] = useState(true)
    const [approvedComing, setApprovedComing] = useState({})
    const [phoneNums, setPhoneNums] = useState([])
    const [option, setOption] = useState(2)
    const [displayMsg, setDisplayMsg] = useState('משהו השתבש בשליחת ההודעות, אנא פנו אליי במייל לקבלת החזר כספי- eldorizem@gmail.com')
    const [lengthOfSmsList, setLengthOfSmsList] = useState(0)

    const [selectTxt,setSelectTxt]=useState('שלח אישורי הגעה')
    const [wereSmssSent,setWereSmssSent]=useState(null)

    const [modalVisible1, setModalVisible1] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [modalVisible3, setModalVisible3] = useState(false)

    const data = [
        {
            label: selectTxt
        },
        {
            label: 'שלח הודעה לכל המוזמנים'
        }
    ];

    // InAppPurchases.connectAsync()

    useEffect(()=>{
        if(wereSmssSent!=null){
            setSelectTxt('שלח אישורי הגעה לאלו שטרם אישרו הגעה')
        }
    },[wereSmssSent])

    useEffect(() => {
        const db = getDatabase();
        const invites = ref(db, props.email + '/invites/');
        onValue(invites, (snapshot) => {
            setInviteList(snapshot.val())
        })

        const sentSmss = ref(db, props.email + '/smsSent/');
        onValue(sentSmss, (snapshot) => {
            setWereSmssSent(snapshot.val())
        })



        const invites2 = ref(db, props.email + '/invites/');
        onValue(invites2, (snapshot) => {
            setFullInviteList(snapshot.val())
        })

        // fetching returned msgs list
        const returnedMsgs = ref(db, props.email + '/returnMessages/');
        onValue(returnedMsgs, (snapshot) => {
            setApprovedComing(snapshot.val())
        })

        const maxInvites = ref(db, props.email + '/maxInvites/maxInvites/')
        onValue(maxInvites, (snapshot) => {
            setMaximumInvites(snapshot.val())
        })
    }, [])


    useEffect(() => {

        if ((!(inviteList == null))) {
            Object.keys(inviteList).forEach(key => {
                if (!(approvedComing == null)) {
                    // removing from invite list those who approved arrival in order to send sms to those who didn't approve yet
                    Object.keys(approvedComing).forEach(key2 => {
                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '')
                        key3 = key3.replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '')
                        key4 = key4.replace('+972', '0')
                        if (key3 === key4) {
                            
                            delete inviteList[key]
                        }
                    })
                }
            })
        }
    }, [approvedComing, inviteList])


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
                const db = getDatabase()
                if (maximumInvites == null) {
                    set(ref(db, props.email + '/maxInvites/'), {
                        maxInvites: 0
                    });
                    setMaximumInvites(0)
                }
                var successAll = true

                // sending smss to filtered invite list
                if (option === 1) {
                    if (inviteList != null) {
                        setLengthOfSmsList(Object.keys(inviteList).length)
                        if (maximumInvites - Object.keys(inviteList).length >= 0) {
                            for (let numbers = 0; numbers < Object.keys(inviteList).length; numbers = numbers + 1) {
                                
                                let phoneNumberForUrl = Object.keys(inviteList)[numbers].replace(' ', '%20')
                                SmsAndroid.autoSend(
                                    Object.keys(inviteList)[numbers],
                                    (text + ' לאישור הגעה לחצ/י על הקישור https://HatunApp.web.app/' + props.email + '/' + phoneNumberForUrl),
                                    (fail) => {
                                        set(ref(db, props.email + '/error/'), {
                                            error: fail
                                        });
                                        err = fail
                                        successAll = false
                                    },
                                    (success) => {

                                        if (((numbers === Object.keys(fullInviteList).length - 1) ||
                                            numbers === Object.keys(fullInviteList).length) && successAll) {
                                            set(ref(db, props.email + '/maxInvites/'), {
                                                maxInvites: maximumInvites - Object.keys(fullInviteList).length
                                            });
                                            setMaximumInvites(maximumInvites - Object.keys(fullInviteList).length)
                                        }
                                    },
                                )
                            }
                            if (!successAll) {
                                setDisplayMsg(err + 'משהו השתבש בשליחת ההודעות, אנא פנו אליי במייל לקבלת החזר כספי- eldorizem@gmail.com')
                                setModalVisible1(true)
                                set(ref(db, props.email + '/maxInvites/'), {
                                    maxInvites: maximumInvites
                                });
                            } else {
                                set(ref(db, props.email + '/smsSent/'), {
                                    sms: 'ok'
                                });
                                setModalVisible2(true)
                            }
                        }
                        else {
                            setModalVisible3(true)
                            // alert('נשארו ' + maximumInvites + '-הודעות לשליחה, את/ה מנסה לשלוח הודעות ל-' + phoneNums.length + 'אנשים,' + ', ניתן לקנות עוד הודעות בתפריט קניית הודעות')
                        }
                    }

                }
                else {
                    if (fullInviteList != null) {
                        setLengthOfSmsList(Object.keys(fullInviteList).length)
                        if (maximumInvites - Object.keys(fullInviteList).length >= 0) {
                            for (let numbers = 0; numbers < Object.keys(fullInviteList).length; numbers = numbers + 1) {

                                SmsAndroid.autoSend(
                                    Object.keys(fullInviteList)[numbers],
                                    (text),
                                    (fail) => {
                                        set(ref(db, props.email + '/error/'), {
                                            error: fail
                                        });
                                        err = fail
                                        successAll = false
                                    },
                                    (success) => {

                                        if (((numbers === Object.keys(fullInviteList).length - 1) ||
                                            numbers === Object.keys(fullInviteList).length) && successAll) {
                                            set(ref(db, props.email + '/maxInvites/'), {
                                                maxInvites: maximumInvites - Object.keys(fullInviteList).length
                                            });
                                            setMaximumInvites(maximumInvites - Object.keys(fullInviteList).length)
                                        }
                                    },
                                )
                            }
                            if (!successAll) {
                                setDisplayMsg(err + 'משהו השתבש בשליחת ההודעות, אנא פנו אליי במייל לקבלת החזר כספי- eldorizem@gmail.com')
                                setModalVisible1(true)
                                set(ref(db, props.email + '/maxInvites/'), {
                                    maxInvites: maximumInvites
                                });
                            } else {
                                setModalVisible2(true)
                            }
                        }
                        else {
                            setModalVisible3(true)
                            // alert('נשארו ' + maximumInvites + '-הודעות לשליחה, את/ה מנסה לשלוח הודעות ל-' + phoneNums.length + 'אנשים,' + ', ניתן לקנות עוד הודעות בתפריט קניית הודעות')
                        }
                    }

                }

            } else {
                console.log("SENDSMS permission denied");
            }
        } catch (err) {
            console.log(err);
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


    const [texts, setTexts] = useState(['תודה שהגעתם לשמוח בשמחתינו, ב(סוג אירוע) של ___ ו___',
        'אנו נרגשים להזמינכם ל(סוג האירוע:חתונה/בר מצווה...) של ___ ו___\nשיערך בתאריך ___ בשעה ___ באולם האירועים (אולם).\nבכתובת:(כתובת)\n'
        , 'ה(סוג אירוע:חתונה,בר מצווה...) של ___\n יערך מחר בשעה ___,\nמצפים לראותכם בין אורחינו',])
    const onpress = () => {
        setText()
    }


    return (
        <ImageBackground source={background} resizeMode="cover" style={styles.image}>

            <View style={styles.container}>
                {showMessagesSelect ?
                    <ScrollView>
                        <View style={{ marginTop: 20, backgroundColor: 'rgba(85, 25, 26, 0.6)' }}>
                            <Text style={styles.btnText} >בחר תבנית לשליחת הסמס:</Text>
                        </View>
                        {texts.map((item, index) =>
                            <Blessings
                                text={item}
                                setText={setText}
                                key={index}
                                setShowMessagesSelect={setShowMessagesSelect}
                            />
                        )}
                    </ScrollView>
                    :
                    <View>
                        <View style={{ marginTop: 20, backgroundColor: 'rgba(85, 25, 26, 0.6)' }}>
                            <Text style={styles.btnText} >לחץ על ההודעה:</Text>
                            <Text style={styles.btnText} >כדי לערוך אותה:</Text>
                        </View>
                        <TextInput
                            style={styles.textInputText}
                            onChangeText={text => setText(text)}
                            multiline={true}
                            editable
                            maxLength={155}
                            value={text}
                        />
                        <View style={{backgroundColor:'rgba(255,255,255,0.9)',marginTop:0,width: 350,borderBottomRightRadius:15,borderBottomLeftRadius:15,marginLeft:20,marginRight:20,}}>
                        {option===1&&<Text style={styles.btnText}>לאישור הגעתכם לחצו על הלינק: (לינק)</Text>}
                        </View>
                        <RadioButtonRN
                            data={data}
                            textStyle={{ fontSize: 20, fontWeight: 'bold' }}
                            selectedBtn={(e) => (e.label === 'שלח הודעה לכל המוזמנים') ?
                                setOption(2) : setOption(1)
                            }
                            boxDeactiveBgColor='rgba(122, 135, 122, 0.7)'
                            boxActiveBgColor='rgba(122, 135, 122, 0.7)'
                        />
                        <TouchableOpacity style={styles.sendSmsBtn} onPress={alert}>
                            <Text style={styles.btnText} >שלח סמסים</Text>
                        </TouchableOpacity>
                    </View>
                }



                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible1}
                        onRequestClose={() => {
                            setModalVisible1(!modalVisible1);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>{displayMsg}</Text>
                                <View style={{ justifyContent: 'space-between' }}>
                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={() => setModalVisible1(!modalVisible1)}
                                    >
                                        <Text style={styles.textStyle}>אוקיי</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>ההודעות נשלחו בהצלחה!</Text>
                                <View style={{ justifyContent: 'space-between' }}>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalVisible2(!modalVisible2)}
                                    >
                                        <Text style={styles.textStyle}>אוקיי</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible3}
                        onRequestClose={() => {
                            setModalVisible3(!modalVisible3);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>שליחת {lengthOfSmsList} ההודעות נכשלה, נותרו {maximumInvites} הודעות לשליחה</Text>
                                <View style={{ justifyContent: 'space-between' }}>
                                    <Pressable
                                        style={[styles.button, styles.greenBtn]}
                                        onPress={() => setModalVisible3(!modalVisible3)}
                                    >
                                        <Text style={styles.textStyle}>לרכישת הודעות נוספות</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.grayBtn]}
                                        onPress={() => setModalVisible3(!modalVisible3)}
                                    >
                                        <Text style={styles.textStyle}>אני אוותר הפעם</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

            </View>
        </ImageBackground>


    );
};
export default SmsMenu;

const styles = StyleSheet.create({

    btn: {
        marginTop: 40,
        backgroundColor: 'rgba(256, 256, 256, 0.6)',
        width: 350,
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
        
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom:0,
        width: 350,
        height: 350,
    },
    image: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: "center"
    },
    sendSmsBtn: {
        marginTop: 40,
        backgroundColor: 'rgba(85, 25, 26, 0.6)',
        height: 45,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },








    // MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL 
    grayBtn: {
        backgroundColor: "#b3afaf"
    },
    greenBtn: {
        backgroundColor: "#17d12d"
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#f11",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        padding: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});

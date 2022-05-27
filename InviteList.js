import React, { useState, useEffect } from 'react';
import XLSX from 'xlsx'
import { writeFile, readFile, DocumentDirectoryPath, DownloadDirectoryPath } from 'react-native-fs'
// Import all required component
import {
    PermissionsAndroid,
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
    Modal,
    ToastAndroid,
    Linking,

} from 'react-native';
import { Button } from 'react-native-paper';

import Contacts2 from 'react-native-contacts';
import background from './bg11.png'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'
import { async } from '@firebase/util';





const InviteList = (props) => {
    const DDP = DownloadDirectoryPath + '/'
    const input = res => res
    const output = str => str
    var RNFS = require('react-native-fs');

    const [approvedComing, setApprovedComing] = useState({})
    const [inviteList, setInviteList] = useState({})
    const [approvedComingButUnarranged, setapprovedComingButUnarranged] = useState({})
    const [finalList, setFinalList] = useState([])
    const [totalPeopleComing, setTotalPeopleComing] = useState(0)
    const [returnMsg, setReturnMsg] = useState({})
    const [sample_data_to_export, setSampleDataToExport] = useState([])
    const [modalVisible3, setModalVisible3] = useState(false)
    const [modalText, setModalText] = useState('')
    const [modalText2, setModalText2] = useState('')
    const [approvedButUnarrangedArray, setApprovedButUnarrangedArray] = useState([])
    const [btnText,setBtnText]=useState('סגור')

    useEffect(() => {
        const db = getDatabase();
        const approvedPeople = ref(db, props.email + '/approvedList/');
        onValue(approvedPeople, (snapshot) => {
            setApprovedComing(snapshot.val())
        })


        const invites = ref(db, props.email + '/invites/');
        onValue(invites, (snapshot) => {
            setInviteList(snapshot.val())
        })
        const invites2 = ref(db, props.email + '/invites/');
        onValue(invites2, (snapshot) => {
            setapprovedComingButUnarranged(snapshot.val())
        })

        const returnedMsgs = ref(db, props.email + '/returnMessages/');
        onValue(returnedMsgs, (snapshot) => {
            setReturnMsg(snapshot.val())
        })
    }, [])


    useEffect(() => {
        if ((!(inviteList == null))) {
            Object.keys(inviteList).forEach(key => {
                if (!(approvedComing == null)) {
                    Object.keys(approvedComing).forEach(key2 => {

                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '')
                        key3 = key3.replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '')
                        key4 = key4.replace('+972', '0')
                        if (key3 === key4) {
                            setFinalList(prevList => { return [...prevList, [key3, approvedComing[key2].displayName, approvedComing[key2].category, approvedComing[key2].peopleComing]] })
                            delete inviteList[key]
                        }
                    })
                }

                if (!(returnMsg == null)) {
                    var deleteThisKey = false
                    // if found same phone number in both the complete invite list and in returnedMsgs it keeps it in
                    // the approvedComingButUnarranged array, otherwise it deletes it
                    Object.keys(returnMsg).forEach(key2 => {
                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '')
                        key3 = key3.replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '')
                        key4 = key4.replace('+972', '0')

                        if (key3 === key4) {
                            deleteThisKey = true
                        }
                    })
                    if (deleteThisKey) {
                        // console.log('test')
                        delete inviteList[key]
                        setFinalList(prevList => { return [...prevList, ['test']] })
                    }
                }
            })
        }
    }, [approvedComing, inviteList, returnMsg])


    useEffect(() => {
        if (!(returnMsg == null)) {
            Object.values(returnMsg).forEach(value => {
                setTotalPeopleComing((prevPeople) => prevPeople + value)
            })
        }
    }, [returnMsg])


    // invitelist -(minus) those who didn't return msg -(minus) those who are approved coming and arranged in a specific category
    useEffect(() => {
        if (approvedComingButUnarranged != null) {
            Object.keys(approvedComingButUnarranged).forEach(key => {
                if (!(returnMsg == null)) {
                    Object.keys(returnMsg).forEach(key2 => {
                        // check if the person approved coming
                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
                        if (key3 === key4) {
                            // check if the person is already in a category
                            if (!(approvedComing == null)) {
                                // console.log('approved coming isnt null')
                                var existInApprovedComing = false
                                Object.keys(approvedComing).forEach(key3 => {
                                    var key5 = key3.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
                                    if (key5 === key4) {
                                        existInApprovedComing = true
                                    }
                                })
                                if (!existInApprovedComing) {
                                    setApprovedButUnarrangedArray((prevArray => { return [...prevArray, [approvedComingButUnarranged[key].displayName, approvedComingButUnarranged[key].phoneNum, returnMsg[key2]]] }))
                                    // console.log('doesnt exist in approved coming', approvedComingButUnarranged[key].phoneNum)
                                }
                            } else {
                                setApprovedButUnarrangedArray((prevArray => { return [...prevArray, [approvedComingButUnarranged[key].displayName, approvedComingButUnarranged[key].phoneNum, returnMsg[key2]]] }))

                            }
                        }
                    })
                }
            })
        }
    }, [approvedComing, approvedComingButUnarranged, returnMsg])


    useEffect(() => {
        if (sample_data_to_export.length !== 0) {
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(sample_data_to_export)
            XLSX.utils.book_append_sheet(wb, ws, "רשימת מוזמנים")
            const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

            RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/רשימת מוזמנים.xlsx', wbout, 'ascii').then((r) => {
                setModalText('קובץ האקסל נשמר בהצלחה תחת התיקייה הראשית!')
                setBtnText('סגור')
                setModalVisible3(true)
            }).catch((e) => {
                setModalVisible3(true)


                setModalText(' הייתה תקלה בשמירת קובץ אקסל:' + e)
                setModalText2('נסה להיכנס ל:הרשאות->אחסון\n ושם בחרו באפשרות: אישור לניהול כל הקבצים')
                setBtnText('לחצו כאן כדי לנסות')
            });
        }

    }, [sample_data_to_export])


    const exportDataToExcel = () => {
        setSampleDataToExport([])
        if (approvedComing != null) {
            Object.keys(approvedComing).forEach((element, index) => {
                if (approvedComing[element].category === 'addOther1') {
                    setSampleDataToExport((prevData) => [...prevData, { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'אחר (1)', סכום: '' }])
                }
                if (approvedComing[element].category === 'addParentsFriends') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'חברים של ההורים', סכום: '' }])
                }
                if (approvedComing[element].category === 'addBrotherFriends') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'חברים של האחים', סכום: '' }])
                }
                if (approvedComing[element].category === 'addJobBride') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'עבודה כלה', סכום: '' }])
                }
                if (approvedComing[element].category === 'addJobGroom') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'עבודה חתן', סכום: '' }])
                }
                if (approvedComing[element].category === 'addFriendsBride') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'חברים כלה', סכום: '' }])
                }
                if (approvedComing[element].category === 'addFriendsGroom') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'חברים חתן', סכום: '' }])
                }
                if (approvedComing[element].category === 'addDistanceFriends') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'חברים רחוקים', סכום: '' }])
                }
                if (approvedComing[element].category === 'addFamilyBride') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'משפחה כלה', סכום: '' }])
                }
                if (approvedComing[element].category === 'addFamilyGroom') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'משפחה חתן', סכום: '' }])
                }
                if (approvedComing[element].category === 'addDistanceFamily') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'משפחה רחוקה', סכום: '' }])
                }
                if (approvedComing[element].category === 'addOther1') {
                    setSampleDataToExport((prevData) => [...prevData,
                    { שם: approvedComing[element].displayName, אנשים: approvedComing[element].peopleComing, קטגוריה: 'אחר (2)', סכום: '' }])
                }
            })
        }
        if (approvedComingButUnarranged != null) {
            // console.log('test')
            approvedButUnarrangedArray.forEach((data) => {
                setSampleDataToExport((prevData) => [...prevData,
                { שם: data[0], אנשים: data[2], קטגוריה: 'ללא קטגוריה', סכום: '' }])
            })
        }

        if (inviteList != null) {
            Object.keys(inviteList).forEach((element) => {
                setSampleDataToExport((prevData) => [...prevData,
                { שם: inviteList[element].displayName, אנשים: '', קטגוריה: 'לא אישר/ה הגעה', סכום: '' }])
            })

        }



        // Created Sample data


        // Write generated excel to Storage


    }


    const exportToExcel = async () => {

        try {
            // Check for Permission (check if permission is already given or not)
            let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            // let isPermitedExternalStorage2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE);

            if (!isPermitedExternalStorage) {

                // Ask for permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
                    {
                        title: "Storage permission needed",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );


                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission Granted (calling our exportDataToExcel function)
                    ToastAndroid.show('מכין את האקסל, אנא המתן...', ToastAndroid.LONG, ToastAndroid.CENTER)
                    exportDataToExcel();
                    // console.log("Permission granted");
                } else {
                    // Permission denied
                    // console.log("Permission denied");
                }
            } else {
                // Already have Permission (calling our exportDataToExcel function)
                exportDataToExcel();
            }
        } catch (e) {
            // console.log('Error while checking permission');
            // console.log(e);
            return
        }

    }


    const modalBtnClicked=()=>{
        if(btnText==='לחצו כאן כדי לנסות'){
            Linking.openSettings('permissions');
        }
        setModalVisible3(!modalVisible3)
    }


    useEffect(() => {
        const backAction = () => {
            props.setShowInviteList(false)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);



    return (


        <ImageBackground source={background} resizeMode="cover" style={styles.image}>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Button style={styles.otherBtn3} onPress={exportToExcel} title=''><Text style={styles.text2}>ייצא רשימה לאקסל</Text></Button>
                <View style={styles.categoryName3}><Text style={styles.text}>סה"כ אישרו הגעה: {totalPeopleComing} מוזמנים</Text></View>

                <View style={styles.categoryName}><Text style={styles.text}>חברים של ההורים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addParentsFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים של האחים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addBrotherFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>עבודה כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addJobBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>עבודה חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addJobGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFriendsBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFriendsGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים רחוקים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addDistanceFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFamilyBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFamilyGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה רחוקה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addDistanceFamily' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>אחר(1)</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addOther1' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>אחר(2)</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addOther2' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName.replace(' ', '-')}</Text>
                        <Text style={styles.text}> {approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}




                <View style={styles.categoryName2}><Text style={styles.text}>אישרו הגעה ללא קטגוריה:</Text></View>

                {/* {(!(approvedComingButUnarranged == null)) && Object.keys(approvedComingButUnarranged).map((keyName, i) => (
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>
                            {approvedComingButUnarranged[keyName].phoneNum + " " + approvedComingButUnarranged[keyName].displayName}
                        </Text>
                    </View>
                ))} */}
                {
                    approvedButUnarrangedArray.map((data) => {
                        return (
                            <View style={styles.approvedView}>
                                <Text style={styles.text}>
                                    {data[0]} {data[1]}
                                </Text>
                                <Text style={styles.text}>
                                    {data[2]} אנשים
                                </Text>

                            </View>
                        )
                    })
                }


                <View style={styles.categoryName2}><Text style={styles.text}>המוזמנים שלא אישרו הגעה:</Text></View>

                {(!(inviteList == null)) && Object.keys(inviteList).map((keyName, i) => (
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>
                            {inviteList[keyName].displayName}
                        </Text>
                        <Text style={styles.text}>
                            {inviteList[keyName].phoneNum.replace(' ', '-')}
                        </Text>
                    </View>
                ))}

            </ScrollView>

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
                        <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>{modalText}</Text>
                        {btnText==='לחצו כאן כדי לנסות'&&<Text style={{ color: '#f00', fontSize: 20, textAlign: 'center',fontWeight:'bold' }}>{modalText2}</Text>}
                            <View style={{ justifyContent: 'space-between' }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => modalBtnClicked()}
                                >
                                    <Text style={styles.textStyle}>{btnText}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>

    );
};
export default InviteList;

const styles = StyleSheet.create({
    approvedView: {
        backgroundColor: 'rgba(170, 191, 184, 0.8)',
        marginTop: 15,
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 10,
        minWidth: 400,
    },
    scrollViewStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    btnView: {
        flex: 1,
        alignItems: 'center'
    },
    splitBtn: {
        flexDirection: 'row',
        flex: 1
    },
    categoryName: {
        backgroundColor: 'rgba(82, 73, 73, 0.5)',
        width: 400,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

    },
    categoryName2: {
        backgroundColor: 'rgba(82, 73, 73, 0.8)',
        width: 400,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

    },
    categoryName3: {
        backgroundColor: 'rgba(82, 73, 73, 0.7)',
        width: 400,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    btn: {
        backgroundColor: 'rgba(99, 88, 68, 0.7)',
        height: 60,
        width: 250,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    btn2: {
        backgroundColor: 'rgba(99, 88, 68, 0.9)',
        height: 60,
        width: 190,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    otherBtn2: {
        backgroundColor: 'rgba(0, 20, 00, 0.5)',
        height: 60,
        width: 190,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    otherBtn3: {
        backgroundColor: 'rgba(35, 136, 145, 1)',
        height: 60,
        width: 400,
        marginTop: 80,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    displayNameMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "#2b1526",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',
    },
    text2: {
        color: "#6b1526",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',
    },
    textOther: {
        color: "#2b1526",
        fontFamily: 'BonaNova-Bold',
        fontSize: 17,
        textAlign: 'center',
    },










    // MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL 
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

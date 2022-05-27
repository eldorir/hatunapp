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
    Modal,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';

import Contacts2 from 'react-native-contacts';
import background from './bg11.png'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'
import { async } from '@firebase/util';

const InviteList = (props) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [approvedComing, setApprovedComing] = useState({})
    const [inviteList, setInviteList] = useState({})
    const [finalList, setFinalList] = useState([])
    const [finalListClone, setFinalListClone] = useState([])
    const [totalPeopleComing, setTotalPeopleComing] = useState(0)

    useEffect(() => {
        // console.log('fetching approved list')
        const db = getDatabase();
        const returnedMsgs = ref(db, props.email + '/approvedList/');
        onValue(returnedMsgs, (snapshot) => {
            setApprovedComing(snapshot.val())
        })


        const invites = ref(db, props.email + '/invites/');
        onValue(invites, (snapshot) => {
            setInviteList(snapshot.val())
        })
    }, [])

    useEffect(() => {
        if ((!(inviteList == null))) {
            Object.keys(inviteList).forEach(key => {
                if (!(approvedComing == null)) {
                    Object.keys(approvedComing).forEach(key2 => {
                        // console.log(inviteList[key].phoneNum)
                        // console.log(key2)

                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '')
                        key3 = key3.replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '')
                        key4 = key4.replace('+972', '0')
                        if (key3 === key4) {
                            console.log(key3 + ' was added to final List')
                            setFinalList(prevList => { return [...prevList, [key3, approvedComing[key2].displayName, approvedComing[key2].category, approvedComing[key2].peopleComing]] })
                            setTotalPeopleComing((prevPeople) => prevPeople + parseInt(approvedComing[key2].peopleComing))
                            delete inviteList[key]
                        }
                    })
                }
            })


        }

    }, [approvedComing, inviteList])


    const deleteFromInviteList=async(phone)=>{
        console.log('remove')
        await database().ref('/'+props.email+'/invites/'+phone).remove()
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


                <View style={styles.categoryName3}><Text style={styles.text}>סה"כ אישרו הגעה: {totalPeopleComing} מוזמנים</Text></View>

                <View style={styles.categoryName}><Text style={styles.text}>חברים של ההורים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addParentsFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים של האחים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addBrotherFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>עבודה כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addJobBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>עבודה חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addJobGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFriendsBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFriendsGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>חברים רחוקים</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addDistanceFriends' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה כלה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFamilyBride' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה חתן</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addFamilyGroom' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>משפחה רחוקה</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addDistanceFamily' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>אחר(1)</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addOther1' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}>{approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}
                <View style={styles.categoryName}><Text style={styles.text}>אחר(2)</Text></View>
                {(!(approvedComing == null)) && Object.keys(approvedComing).map((keyName, i) => (
                    approvedComing[keyName].category === 'addOther2' &&
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>{approvedComing[keyName].displayName + " " + keyName}</Text>
                        <Text style={styles.text}> {approvedComing[keyName].peopleComing} אנשים</Text>
                    </View>
                ))}




                <View style={styles.categoryName2}><Text style={styles.text}>המוזמנים שלא אישרו הגעה:</Text></View>

                {(!(inviteList == null)) && Object.keys(inviteList).map((keyName, i) => (
                    <View style={styles.approvedView}>
                        <Text style={styles.text}>
                            {inviteList[keyName].phoneNum + " " + inviteList[keyName].displayName}
                            <TouchableOpacity  style={styles.image} onPress={()=>deleteFromInviteList(keyName)}>
                                <Image style={styles.image2} source={require('./deleteIcon.png')} />
                            </TouchableOpacity >
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>

    );
};
export default InviteList;

const styles = StyleSheet.create({
    image: {
        textAlign: 'left',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
    },
    image2: {
        flex:1, justifyContent: 'flex-start',
        alignItems:'flex-start',
        alignSelf:'flex-start',
        // alignItems: 'center',
        // marginTop: 15,
        // alignSelf: 'center'
    },
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
        width: 300,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

    },
    categoryName2: {
        backgroundColor: 'rgba(82, 73, 73, 0.8)',
        width: 300,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

    },
    categoryName3: {
        backgroundColor: 'rgba(82, 73, 73, 0.7)',
        width: 300,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
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
    textOther: {
        color: "#2b1526",
        fontFamily: 'BonaNova-Bold',
        fontSize: 17,
        textAlign: 'center',
    },










    // MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL 
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
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },

});

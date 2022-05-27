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

} from 'react-native';
import { Button } from 'react-native-paper';

import Contacts2 from 'react-native-contacts';
import background from './bg11.png'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'

const SittingArrangement2 = (props) => {

    const [other1, setOther1] = useState('אחר(1)')
    const [other2, setOther2] = useState('אחר(2)')
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    // index to go through the invited user who confirmed coming to the event's array
    const [currentIndex, setCurrentIndex] = useState(0)
    // object containing those who returned messages
    const [approvedComing, setApprovedComing] = useState({})
    // list of all those who were invited
    const [inviteList, setInviteList] = useState({})
    const [finalList, setFinalList] = useState([])

    // list of people who are already in a category
    const [approvedReadyList, setApprovedReadyList] = useState({})

    const [inviteListLength, setinviteListLength] = useState(0)
    // display number of people:
    const [numberOfPeople, setNumberOfPeople] = useState(0)

    useEffect(() => {
        // fetching approved list
        const db = getDatabase();
        const approved = ref(db, props.email + '/approvedList/');
        onValue(approved, (snapshot) => {
            setApprovedReadyList(snapshot.val())
        })
        // fetching returned msgs list
        const returnedMsgs = ref(db, props.email + '/returnMessages/');
        onValue(returnedMsgs, (snapshot) => {
            setApprovedComing(snapshot.val())
        })

        // fetching all the invited people's list
        const invites = ref(db, props.email + '/invites/');
        onValue(invites, (snapshot) => {
            setInviteList(snapshot.val())
        })
    }, [])


    // find number of people of the current index to display
    useEffect(() => {
        if (inviteList != null) {
            // if (!(approvedComing == null)) {
            //     // removing from invite list those who don't appear in returnMessage(approvedComing) list
            //     Object.keys(approvedComing).forEach((key2,index) => {
            //         var key3 = key2.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')

            //         var key4 = Object.keys(inviteList)[currentIndex].replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
            //         if(key3===key4){
            //             setNumberOfPeople(Object.values(approvedComing)[index])
            //         }
            //     })
            // }

            if (Object.keys(inviteList).length) {
                if (currentIndex !== Object.keys(inviteList).length) {
                    // var key=Object.keys(inviteList)[currentIndex].replace(' ','').replace('-','').replace('-','')
                    var key = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                    if (key.substring(0, 2) === '05') {
                        key = '+972' + key.substring(1)
                    }
                    if (approvedComing != null) {
                        setNumberOfPeople(approvedComing[key])
                    }
                }
            }


        }
    }, [currentIndex, approvedComing, finalList])



    useEffect(() => {
        var foundSamePhoneNum
        if ((!(inviteList == null))) {
            Object.keys(inviteList).forEach(key => {
                if (!(approvedComing == null)) {
                    foundSamePhoneNum = false
                    // removing from invite list those who don't appear in returnMessage(approvedComing) list
                    Object.keys(approvedComing).forEach(key2 => {
                        var key3 = key2.replace(' ', '').replace('-', '').replace('-', '')
                        key3 = key3.replace('+972', '0')
                        var key4 = key.replace(' ', '').replace('-', '').replace('-', '')
                        key4 = key4.replace('+972', '0')
                        if (key3 === key4) {
                            foundSamePhoneNum = true
                        }
                    })
                    if (!foundSamePhoneNum) delete inviteList[key]
                    // removing from invite list those who also appear in approved(approvedReadyList) list
                    if (!(approvedReadyList == null)) {
                        Object.keys(approvedReadyList).forEach(key2 => {
                            var key4 = key.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
                            var key3 = key2.replace(' ', '').replace('-', '').replace('-', '').replace('+972', '0')
                            if (key3 === key4) {
                                delete inviteList[key]
                            }
                        })
                    }
                    setFinalList(inviteList)
                }
                else {
                    // if returnMessage(approvedComing) is empty then set invite list to empty list
                    setInviteList({})
                }

            })
        }
        setinviteListLength(Object.keys(inviteList).length)
    }, [approvedComing, inviteList])


    const changeBtnName = () => {
        if (other1 === 'אחר(1)') {
            setModalVisible1(true)
        }
        addOther1()
    }
    const changeBtnName2 = () => {
        if (other2 === 'אחר(2)') {
            setModalVisible2(true)
        }
        addOther2()
    }
    const other1Changed = (text) => {
        setOther1(text)
    }
    const other2Changed = (text) => {
        setOther2(text)
    }



    useEffect(() => {
        const backAction = () => {
            props.setShowSittingArrangement(false)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);



    const addParentsFriends = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addParentsFriends',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addOther1 = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addOther1',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addOther2 = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addOther2',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addBrotherFriends = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addBrotherFriends',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addJobBride = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addJobBride',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addJobGroom = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addJobGroom',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addFriendsBride = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addFriendsBride',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addFriendsGroom = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addFriendsGroom',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addDistanceFriends = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addDistanceFriends',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addDistanceFamily = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addDistanceFamily',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addFamilyBride = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addFamilyBride',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const addFamilyGroom = () => {
        if (!(inviteList == null)) {
            if (currentIndex !== Object.keys(inviteList).length) {
                const db = getDatabase();

                var internetionalNumber = inviteList[Object.keys(inviteList)[currentIndex]].phoneNum.replace(' ', '').replace('-', '').replace('-', '')
                if (internetionalNumber.substring(0, 2) === '05') {
                    internetionalNumber = '+972' + internetionalNumber.substring(1)
                }
                set(ref(db, props.email + '/approvedList/' + inviteList[Object.keys(inviteList)[currentIndex]].phoneNum + '/'), {
                    displayName: inviteList[Object.keys(inviteList)[currentIndex]].displayName,
                    peopleComing: approvedComing[internetionalNumber],
                    category: 'addFamilyGroom',
                });
                setCurrentIndex(currentIndex + 1)
            }
        }
    }
    const showInviteList = () => {
        if (currentIndex !== Object.keys(inviteList).length) {
            setCurrentIndex(currentIndex + 1)
            // add to this group in the database
        }
    }
    const skip = () => {
        if (currentIndex !== Object.keys(inviteList).length) {
            setCurrentIndex(currentIndex + 1)
            // add to this group in the database
        }
    }


    return (


        <ImageBackground source={background} resizeMode="cover" style={styles.image}>
            <View style={styles.displayNameMain}>
                <View style={styles.displayName}>


                    {Object.keys(inviteList).length === 0 || Object.keys(inviteList).length === currentIndex ?
                        <Text style={styles.text}>לא נותרו מוזמנים למיין/טוען מוזמנים</Text>
                        :
                        <View>
                            {Object.keys(inviteList).map((value, index) =>
                                index === currentIndex &&
                                <View>
                                    <Text style={styles.text}>איפה יישב/ו:</Text>
                                    <Text style={styles.text}>{inviteList[value].displayName + " " + inviteList[value].phoneNum.replace(' ', '-')}</Text>
                                    <Text style={styles.text}>{numberOfPeople} אנשים</Text>
                                </View>
                            )}
                        </View>
                    }
                </View>
            </View>
            <View style={styles.btnView}>
                <Button style={styles.btn} title='' onPress={addParentsFriends}><Text style={styles.text}>חברים של ההורים</Text></Button>
            </View>
            <View style={styles.btnView}>
                <Button style={styles.btn} title='' onPress={addBrotherFriends}><Text style={styles.text}>חברים של האחים</Text></Button>
            </View>
            <View style={styles.splitBtn}>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addJobBride}><Text style={styles.text}>עבודה כלה</Text></Button>
                </View>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addJobGroom}><Text style={styles.text}>עבודה חתן</Text></Button>
                </View>
            </View>
            <View style={styles.splitBtn}>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addFriendsBride}><Text style={styles.text}>חברים כלה</Text></Button>
                </View>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addFriendsGroom}><Text style={styles.text}>חברים חתן</Text></Button>
                </View>
            </View>
            <View style={styles.btnView}>
                <Button style={styles.btn} title='' onPress={addDistanceFriends}><Text style={styles.text}>חברים רחוקים</Text></Button>
            </View>
            <View style={styles.splitBtn}>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addFamilyBride}><Text style={styles.text}>משפחה כלה</Text></Button>
                </View>
                <View style={styles.btnView}>
                    <Button style={styles.btn2} title='' onPress={addFamilyGroom}><Text style={styles.text}>משפחה חתן</Text></Button>
                </View>
            </View>
            <View style={styles.btnView}>
                <Button style={styles.btn} title='' onPress={addDistanceFamily}><Text style={styles.text}>משפחה רחוקה</Text></Button>
            </View>
            <View style={styles.splitBtn}>
                <View style={styles.btnView}>
                    <Button style={styles.btnSkip} title='' onPress={changeBtnName}><Text style={styles.textOther}>{other1}</Text></Button>
                </View>
                <View style={styles.btnView}>
                    <Button style={styles.btnSkip} title='' onPress={changeBtnName2}><Text style={styles.textOther}>{other2}</Text></Button>
                </View>
            </View>
            <View style={styles.splitBtn}>


                <View style={styles.btnView}>
                    <Button style={styles.btnSkip} title='' onPress={skip}><Text style={styles.text}>דלג</Text></Button>
                </View>
            </View>




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
                            <Text style={{ color: '#000' }}>צור קבוצה חדשה:</Text>
                            <TextInput style={{ color: '#000' }} onChangeText={other1Changed} placeholder='אחר(1)'></TextInput>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible1(!modalVisible1)}
                            >
                                <Text style={styles.textStyle}>שמור</Text>
                            </Pressable>
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
                            <Text style={{ color: '#000' }}>צור קבוצה חדשה:</Text>
                            <TextInput style={{ color: '#000' }} onChangeText={other2Changed} placeholder='אחר(2)'></TextInput>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible2(!modalVisible2)}
                            >
                                <Text style={styles.textStyle}>שמור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>










        </ImageBackground>

    );
};
export default SittingArrangement2;

const styles = StyleSheet.create({
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

    btn: {
        backgroundColor: 'rgba(170, 191, 184, 0.8)',
        height: 60,
        width: 250,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    btn2: {
        backgroundColor: 'rgba(82, 73, 73, 0.5)',
        height: 60,
        width: 170,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,

        borderRadius: 15,
    },
    btnSkip: {
        backgroundColor: 'rgba(82, 73, 73, 0.85)',
        height: 60,
        width: 170,
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
    displayName: {
        // marginTop:40,
        // marginBottom:40,

        // height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,

        borderRadius: 15,
        backgroundColor: 'rgba(247, 241, 235, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayNameMain: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "#2b1526",
        fontFamily: 'BonaNova-Bold',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 20,
    },
    textOther: {
        color: "#151565",
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

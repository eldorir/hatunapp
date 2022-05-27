// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

// Import React
import React, { useState, useEffect } from 'react';

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
  ImageBackground,
  SocialButton,

  Modal,
  Pressable,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Contacts from './Contacts'
import { Button } from 'react-native-paper';
// import background from './bg3.webp'
import background from './bg6.jpg'
// import background from './bg4.jpg'
import SmsMenu from './SmsMenu';
import SittingArrangement2 from './SittingArrangement2';
import InviteList from './InviteList'
import { getDatabase, ref, onValue, set } from "firebase/database";

import firebase from './firebase'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {

  const [showContacts, setShowContacts] = useState(false)
  const [inviteList, setInviteList] = useState([])
  const [openSmss, setOpenSmss] = useState(false)
  const [showSittingArrangement, setShowSittingArrangement] = useState(false)
  const [isSelected, setSelection] = useState(false);

  const [showInviteList, setShowInviteList] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [email, setEmail] = useState('')

  const [emailText, setEmailText] = useState('')
  const [codeText, setCodeText] = useState('')
  const [success, setSuccess] = useState(null)

  const [modalVisible5, setModalVisible5] = useState(false)
  const [warningText, setWarningText] = ('שים לב, באפליקציה זו נשלחים מסרונים היישר מהפלאפון של המשתמש, מומלץ לעדכן את חבילת הסלולר לפני השימוש באפליקצייה למניעת חיובים מיותרים (בחבילה עדכנית סטנדרטית יש לכל הפחות 2500 הודעות חינם)')

  useEffect(() => {
    async function getData() {
      try {
        
        const value = await AsyncStorage.getItem('@email')
        if (value !== null) {
          setSignedIn(true)
          setEmail(value)
          const db = getDatabase();
          const starCountRef = ref(db, value + '/code/');
          onValue(starCountRef, (snapshot) => {

            if (snapshot.val() != null) {
              setCodeText(Object.keys(snapshot.val())[0])
            }
          })
        }
        // check if user asked to not show modal message again
        const value2 = await AsyncStorage.getItem('@dont')
        if(value2==null && signedIn){
          setModalVisible5(true)
        }
      } catch (e) {
        // error reading value
      }
    }
    getData()
  }, [signedIn])


  useEffect(() => {

    async function checkIfCodeExists() {
      if (success != null) {
        if (emailText != '') {
          try {
            setEmail(emailText)
            
            setSignedIn(true)
            await AsyncStorage.setItem('@email', emailText.toLowerCase())
            setModalVisible5(true)

            
          } catch (e) {
            // saving error
          }
        }
      }
    }
    checkIfCodeExists()
  }, [success])

  GoogleSignin.configure({
    webClientId: '203177296146-7fftclbs0til31146kkhccn5rl6q6g60.apps.googleusercontent.com',
  });


  const SignInWithEventCode = () => {
    
    const db = getDatabase();
    const starCountRef = ref(db, emailText.toLowerCase() + '/code/' + codeText + '/');
    onValue(starCountRef, (snapshot) => {
      setSuccess(snapshot.val())
    })
    
  }


  const SignInWithGoogleAsync = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn()
    
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then(async (user) => {
      setSignedIn(true)
      console.log(user)
      setEmail(user.additionalUserInfo.profile.email.substring(0, user.additionalUserInfo.profile.email.indexOf('@')))
      const db = getDatabase();

      // const starCountRef = ref(db, emailText.toLowerCase() + '/code/' + codeText + '/');
      // onValue(starCountRef, (snapshot) => {
      //   setSuccess(snapshot.val())
      // })
      let code = Math.floor(Math.random() * 1000000)
      set(ref(db, user.additionalUserInfo.profile.email.substring(0, user.additionalUserInfo.profile.email.indexOf('@')) + '/code/' + code + '/'), {
        success: 'found'
      });
      setCodeText(code)


      try {
        await AsyncStorage.setItem('@email', user.additionalUserInfo.profile.email.substring(0, user.additionalUserInfo.profile.email.indexOf('@')))
        // check if user asked to not show modal message again
        const value2 = await AsyncStorage.getItem('@dont')
        if(value2!=null){
          setModalVisible5(true)
        }
        

      } catch (e) {
        // saving error
      }
    }).catch((error) => {
    })
  }

  const modalOKPressed = async () => {
    setModalVisible5(false)
    if (isSelected) {
      try {
        await AsyncStorage.setItem('@dont', 'true')

        
        const db = getDatabase();
        set(ref(db, email + '/dontshowmsg/'), {
          success:'good'
      });
      

        
      } catch (e) {
        // saving error
      }
    }
  }

  return (

    showInviteList ?
      <InviteList
        setShowInviteList={setShowInviteList}
        email={email}
      /> :
      showSittingArrangement ?
        <SittingArrangement2
          setShowSittingArrangement={setShowSittingArrangement}
          inviteList={inviteList}
          email={email}
        /> :


        <ImageBackground source={background} resizeMode="cover" style={styles.image}>
          {
            (!signedIn) ?
              <View>
                <Button style={styles.signWithGoogleBtn} onPress={SignInWithGoogleAsync} title='' ><Text style={styles.btnText}>הרשמ/י עם גוגל</Text></Button>
                <View style={{borderColor:'rgba(171, 186, 172,0.5)',borderWidth: 5,borderRadius:15,marginTop:15}}>
                <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>או התחבר לחשבון קיים:</Text>
                <TextInput
                  style={{ backgroundColor: 'rgba(240, 240, 86,0.5)', textAlign: 'center', fontWeight: 'bold', borderRadius: 15, color: '#000',marginLeft:15,marginRight:15 }}
                  onChangeText={text => setEmailText(text)}
                  editable
                  maxLength={35}
                  value={emailText}
                  placeholder='אימייל של יוצר האירוע'
                />
                <TextInput
                  style={{ backgroundColor: 'rgba(240, 240, 86,0.5)', marginTop: 15, textAlign: 'center', fontWeight: 'bold', borderRadius: 15, color: '#000',marginLeft:15,marginRight:15 }}
                  onChangeText={text => setCodeText(text)}
                  editable
                  maxLength={35}
                  value={codeText}
                  placeholder='קוד אירוע'

                />
                <Button style={styles.signWithGoogleBtn2} onPress={SignInWithEventCode} title='' ><Text style={styles.btnText}>הכנס לאירוע קיים</Text></Button>
</View>
              </View> :
              openSmss ?
                <SmsMenu
                  email={email}
                  setOpenSendSmsMenu={setOpenSmss}
                  inviteList={inviteList}
                /> :
                showContacts ?
                  <Contacts
                    email={email}
                    setShowContacts={setShowContacts}

                  /> :
                  <View>
                    <Text style={{ backgroundColor: 'rgba(240, 240, 86,0.5)', marginTop: 250, textAlign: 'center', fontWeight: 'bold', borderRadius: 15, color: 'rgba(5, 5, 5,0.65)' }}>קוד אירוע: {codeText}</Text>
                    <Text style={{ backgroundColor: 'rgba(240, 240, 86,0.5)', marginTop: 15, textAlign: 'center', fontWeight: 'bold', borderRadius: 15, color: 'rgba(5, 5, 5,0.65)' }}>{email} :אימייל </Text>
                    <ScrollView>
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Button style={styles.btn4} title='' onPress={() => { setShowContacts(true) }}><Text style={styles.btnText}>הוסף לרשימת מוזמנים</Text></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Button style={styles.btn} title='' onPress={() => { setOpenSmss(true) }}><Text style={styles.btnText}>שלח מסרונים</Text></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Button style={styles.btn} title='' onPress={() => { setShowSittingArrangement(true) }}><Text style={styles.btnText}>סידור שולחנות</Text></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Button style={styles.btn} title='' onPress={() => { setShowInviteList(true) }}><Text style={styles.btnText}>רשימת מוזמנים</Text></Button>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
          }
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible5}
              onRequestClose={() => {
                setModalVisible5(!modalVisible5);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>שים לב, באפליקציה זו נשלחים מסרונים היישר מהפלאפון של המשתמש, מומלץ לעדכן את חבילת הסלולר לפני השימוש באפליקצייה למניעת חיובים מיותרים </Text>
                  <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>(בחבילה עדכנית סטנדרטית יש כ-2500 הודעות חינם)</Text>
                  <Text></Text>
                  <View style={{ justifyContent: 'space-between' }}>
                    <BouncyCheckbox
                      size={25}
                      fillColor="red"
                      unfillColor="#FFFFFF"
                      text="אל תציג הודעה זו שוב"
                      iconStyle={{ borderColor: "red" }}
                      textStyle={{ fontFamily: "JosefinSans-Regular", textDecorationLine: "none" }}
                      onPress={(() => setSelection(!isSelected))}
                    />


                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => modalOKPressed()}
                    >
                      <Text style={styles.textStyle}>אוקיי</Text>
                    </Pressable>

                  </View>
                </View>
              </View>
            </Modal>
          </View>

        </ImageBackground>

  );
};
export default App;

const styles = StyleSheet.create({

  btn: {
    marginTop: 30,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    height: 70,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btn4: {
    marginTop: 20,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    height: 70,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  signWithGoogleBtn: {
    marginTop: 280,
    marginLeft:20,
    marginRight:20,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    height: 50,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  signWithGoogleBtn2: {
    margin: 15,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    height: 50,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btnText: {
    color: "rgba(46, 66, 47,1)",
    fontFamily: 'RubikMoonrocks-Regular',
    fontSize: 20,
  },
  image: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: "center"
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
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },

});
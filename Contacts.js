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
  BackHandler,
  ImageBackground,
  Button,
  Modal,
  Pressable,
  TouchableOpacity,

} from 'react-native';
import { getDatabase, ref, onValue, set } from "firebase/database";

import Contacts2 from 'react-native-contacts';
import ListItem from './ListItem';

import background from './bg10.png'



const Contacts = (props) => {
  let [contacts, setContacts] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false)
  const [inviteList, setInviteList] = useState({})
  const [rerenderList,setRerenderList]=useState(false)
  // useEffect(() => {
  //   if (Object.keys(inviteList).length === 0) {
  //     const db = getDatabase();
  //     const starCountRef = ref(db, props.email+'/invites/');
  //     onValue(starCountRef, (snapshot) => {
  //       setInviteList(snapshot.val())

  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   Object.keys(inviteList).forEach(key=>{

  //   })
  // }, [contacts,inviteList])




  useEffect(() => {
    if (Platform.OS === 'android') {
      async function requestpermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "אנא אשרו גישה לסמסים",
              message: "לחצו על OK",
              buttonNeutral: "שאל מאוחר יותר",
              buttonNegative: "בטל",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            loadContacts();
          }
        }
        catch {
          console.log('failed to ask permissions')
        }
      }

      requestpermission()
    }
  }, []);

  const deleteAllLists = () => {
    setModalVisible1(false)
    const db = getDatabase();

    set(ref(db, props.email + '/approvedList/'), null);
    set(ref(db, props.email + '/returnMessages/'), null);
    set(ref(db, props.email + '/invites/'), null);
    set(ref(db, props.email + '/smsSent/'), null);
    setRerenderList(!rerenderList)
    
  }
  const _onpressed = () => {
    setModalVisible1(true)

  }
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //       title: 'Contacts',
  //       message: 'This app would like to view your contacts.',
  //     }).then(() => {
  //       loadContacts();
  //     }
  //     );
  //   } else {
  //     loadContacts();
  //   }
  // }, []);

  const loadContacts = () => {
    Contacts2.getAll()
      .then(contacts => {
        for (let i = 0; i < contacts.length; i = i + 1) {
          if (contacts[i].givenName == null) {
            contacts.splice(i, 1)
          }
          if (!contacts[i]) {
            contacts.splice(i, 1)
          }
        }

        contacts.sort((a, b) =>
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      })
      .catch(e => {
        alert('לא אישר/ת שימוש באנשי קשר.');
      });
  };

  const search = (text) => {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts2.getContactsByPhoneNumber(text).then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);

      });
    } else {
      Contacts2.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);

      });
    }
  };


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
        <View style={styles.container}>

          <TextInput
            onChangeText={search}
            placeholder="חיפוש"
            style={styles.searchBar}
          />
          <TouchableOpacity onPress={() => _onpressed()}>
            <View style={styles.unchecked}>
              <Text style={styles.titleStyle} >מחק אירוע וצור חדש</Text>
            </View>
          </TouchableOpacity>
          <FlatList
            maxToRenderPerBatch={15}
            initialNumToRender={25}
            data={contacts}
            

            renderItem={(contact) => {
              return (
                <ListItem
                  key={contact.item.recordID}
                  item={contact.item}
                  email={props.email}
                  rerenderList={rerenderList}
                />
              );
            }}
            key={(item) => item.recordID}
            keyExtractor={(item) => item.recordID}
          />
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
              <Text style={{ color: '#000', fontSize:20,textAlign:'center' }}>האם אתה בטוח שאת/ה רוצה למחוק את האירוע?</Text>
              <Text style={{ color: '#f00', fontSize:20,textAlign:'center',fontWeight:'bold'}}>שים לב, כל המידע על האירוע יימחק ולא ניתן יהיה לשחזר אותו!</Text>
                <View style={{justifyContent:'space-between'}}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => deleteAllLists()}
                >
                  <Text style={styles.textStyle}>כן</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible1(!modalVisible1)}
                >
                  <Text style={styles.textStyle}>בטל</Text>
                </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>



      </ImageBackground>
    </SafeAreaView>
  );
};
export default Contacts;

const styles = StyleSheet.create({
  // mainTitleContainer: {
  //   justifyContent: 'center',
  //   flexDirection: 'column',
  //   flex: 1,
  //   justifyContent: 'space-between'
  // },
  titleStyle: {
    // display: 'flex',
    // justifyContent: 'center',
    fontSize: 16,
    color: '#4B0082',
    textAlign: 'center',
  },
  unchecked: {
    flexDirection: 'row',
    minHeight: 44,
    height: 63,
    backgroundColor: 'rgba(31, 181, 46, 0.8)',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  btnText: {
    color: "#d4473d",
    fontFamily: 'RubikMoonrocks-Regular',
    fontSize: 20,
  },
  btn: {
    marginTop: 700,
    backgroundColor: 'rgba(256, 256, 256, 0.6)',
    height: 50,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  searchBar: {
    backgroundColor: '#635844',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
  image: {
    flex: 1,
    justifyContent: "center"
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
    marginTop:20,
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
    fontSize:20,
    padding:15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

});

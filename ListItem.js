



// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

import React, { useEffect, memo, useState, PureComponent } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, } from 'react-native';
import PropTypes from 'prop-types';

// import firestore from '@react-native-firebase/firestore'
// import database from '@react-native-firebase/database';

import { getDatabase, ref, onValue, set } from "firebase/database";
import firebase from './firebase'


// import database from '@react-native-firebase/database';



const ListItem = (props) => {
  const shouldComponentUpdate = () => {
    return false;
  };



  const [checked, setchecked] = useState(false)
  const { item, rerenderList } = props;
  const [inviteList, setInviteList] = useState({})
  const [existInInvitelist,setExistInInvitelist]=useState([])
  useEffect(() => {
    if (!(inviteList == null)) {
      if (Object.keys(inviteList).length === 0) {
        const db = getDatabase();
        const starCountRef = ref(db, props.email + '/invites/');
        onValue(starCountRef, (snapshot) => {
          setInviteList(snapshot.val())
        })
      }
    }
  }, [])
  useEffect(() => {
    if (!(inviteList == null)) {
      if (Object.keys(inviteList).length === 0) {
        const db = getDatabase();
        const starCountRef = ref(db, props.email + '/invites/');
        onValue(starCountRef, (snapshot) => {
          setInviteList(snapshot.val())
        })
      }
    }
  }, [inviteList])


  // setting initial state of item of the list, if it exists in invitelist sets his color to red,
  // otherwise it stays as it was.
  useEffect(() => {
    
    
    if ((inviteList != null)&&Object.keys(inviteList).length) {
      Object.keys(inviteList).forEach(key => {
        if (((item.phoneNumbers[0] && key.replace('-','').replace('-','').replace(' ','') === item.phoneNumbers[0].number) ||
             (item.phoneNumbers[1] && key.replace('-','').replace('-','').replace(' ','') === item.phoneNumbers[1].number))||
         (item.phoneNumbers[0] && key === item.phoneNumbers[0].number)||
         (item.phoneNumbers[1] && key === item.phoneNumbers[1].number)) {
          setchecked(true)
          setExistInInvitelist([...existInInvitelist,key])
        }
      })
    }
  }, [inviteList])



  // rerendering invite list
  useEffect(() => {
    setInviteList({})
    setchecked(false)
  }, [props.rerenderList])






  const _onpressed = (item) => {
    // checks if phone number contains substrings 05/+972, if yes then locks that phone number out of the phone numbers
    let phoneNum
    (item.phoneNumbers[0].number.substring(0, 2) === '05'
      || item.phoneNumbers[0].number.substring(0, 6) === '+972 5' || item.phoneNumbers[0].number.substring(0, 5) === '+9725')
      ?
      phoneNum = item.phoneNumbers[0].number
      :
      phoneNum = item.phoneNumbers[1].number
    let displayName = item.displayName

    // if phone number is without spaces (-) it creates spaces
    if (phoneNum.substring(0, 5) === '+9725') {
      phoneNum = phoneNum.substring(0, 4) + ' ' + phoneNum.substring(4, 6) + '-' + phoneNum.substring(6, 9) + '-' + phoneNum.substring(9)
    }
    if ((!(phoneNum.substring(3, 4) === '-')) && phoneNum.substring(0, 1) !== '+') {
      phoneNum = phoneNum.substring(0, 3) + '-' + phoneNum.substring(3, 6) + '-' + phoneNum.substring(6)
    }
    if (inviteList != null) {
      if (inviteList[phoneNum] == null) {
        setchecked(!checked)
        const db = getDatabase();
        if(checked){
          set(ref(db, props.email + '/invites/' + phoneNum + '/'), null);
          
        }
        else{
          set(ref(db, props.email + '/invites/' + phoneNum + '/'), {
            displayName: displayName,
            phoneNum: phoneNum,
          });
          setExistInInvitelist([...existInInvitelist,phoneNum])
        }
        
        
        
        // setInviteList({ ...inviteList, ...{ phoneNum: phoneNum, displayName: displayName } })
      }
      else {
        const db = getDatabase()
        set(ref(db, props.email + '/invites/' + phoneNum + '/'), null);
        setchecked(false)
      }
    } else {
      setInviteList({ phoneNum: phoneNum, displayName: displayName })
      setchecked(true)
      const db = getDatabase();
      set(ref(db, props.email + '/invites/' + phoneNum + '/'), {
        displayName: displayName,
        phoneNum: phoneNum,
      });
    }




  }


  return (
    !((item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].number
      && (item.phoneNumbers[0].number.substring(0, 2) === '05'
        || item.phoneNumbers[0].number.substring(0, 6) === '+972 5' || item.phoneNumbers[0].number.substring(0, 5) === '+9725'))
      ||
      (item.phoneNumbers && item.phoneNumbers[1] && item.phoneNumbers[1].number &&
        (item.phoneNumbers[1].number.substring(0, 2) === '05' ||
          item.phoneNumbers[1].number.substring(0, 6) === '+972 5' || item.phoneNumbers[1].number.substring(0, 5) === '+9725'))) ?
      null :

      // (!(item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].number)||(item.phoneNumbers && item.phoneNumbers[1] && item.phoneNumbers[1].number))? null:

      // inviteList.includes(listItem => listItem.phonenum===item.phoneNumbers[0].number)?
      // null:
      // Object.keys(inviteList).map((invitelistitem,index)=>{(invitelistitem.phoneNum!==item.phoneNumbers[0].number
      // adding item to invite list only if all the items from inviteList are not equal to it


      <View>
        <TouchableOpacity onPress={() => _onpressed(item)}>
          <View style={checked ? styles.checked : styles.unchecked}>

            <View style={styles.mainTitleContainer}>
              <Text style={styles.titleStyle}>
                <Text
                  style={
                    styles.titleStyle
                  }>{`${item.displayName}`}{'   '}</Text>

                {(item.phoneNumbers[0].number.substring(0, 2) === '05' ||
                  item.phoneNumbers[0].number.substring(0, 6) === '+972 5' ||
                  item.phoneNumbers[0].number.substring(0, 5) === '+9725')
                  ?
                  <Text
                    style={
                      styles.titleStyle2
                    }>{`${item.phoneNumbers[0].number}`}</Text>
                  : <Text
                    style={
                      styles.titleStyle2
                    }>{`${item.phoneNumbers[1].number}`}</Text>
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    // )})







  );
};

const styles = StyleSheet.create({
  unchecked: {
    flexDirection: 'row',
    minHeight: 44,
    height: 63,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderRadius: 15,
  },
  checked: {
    flexDirection: 'row',
    minHeight: 44,
    height: 63,
    backgroundColor: 'rgba(212, 34, 37, 0.45)',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderRadius: 15,
  },

  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  titleStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 16,
    marginTop: 22,
    color: '#4B0082',
    textAlign: 'center',
  },
  titleStyle2: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 16,
    color: '#4B0082',
  },
});

export default memo(ListItem);

ListItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};
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

  PanResponder,
  Animated,
} from 'react-native';
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

import background from './bg10.png'
import { render } from 'react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod';

const SIZE = 100.0

class SittingArrangement extends React.Component {


  constructor() {
    super()
    this.translateY = new Animated.Value(0)
    this.onGestureEvent = Animated.event([
      {
        nativeEvent: {
          translationY: this.translateY
        }
      }
    ],
      { useNativeDriver: true })
      
  }

  onHandlerStateChange = event => {
    if (event.nativeEvent.oldState == State.ACTIVE) {
      Animated.timing(this.translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true
      }).start()
    }
    console.log(event.nativeEvent.translationY)
  }


  render() {


    return (
      <ImageBackground source={background} resizeMode="cover" style={styles.image}>
        {/* <View style={styles.view}>
        {props.inviteList === [] ? <Text style={styles.text}>Hello world</Text>
          :
          <Text style={styles.text}>{props.inviteList[0][1]}</Text>
        }
      </View> */}




        {/* <GestureHandlerRootView style={styles.container}>
          <View onLayout={event => {
            const layout = event.nativeEvent.layout;
            console.log('height:', layout.height);
            console.log('width:', layout.width);
            console.log('x:', layout.x);
            console.log('y:', layout.y);
          }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button style={styles.btn4} title=''><Text style={styles.btnText}>סידור שולחנות</Text></Button>
          </View>
          <PanGestureHandler onGestureEvent={this.onGestureEvent} onHandlerStateChange={this.onHandlerStateChange}>
            <Animated.View style={[styles.square,
            {
              transform: [{ translateY: this.translateY }]
            }]}>
              <Text>hello</Text>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView> */}
      </ImageBackground>

    );
  };
}
export default SittingArrangement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flexDirection: 'row',
    flex: 1,
  },
  btn4: {
    marginTop: 200,
    backgroundColor: 'rgba(31, 181, 46, 0.2)',
    height: 50,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  view: {
    height: 100,
    width: 250,
    backgroundColor: 'rgba(247, 241, 235, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: { color: '#000' },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0,0, 256, 0.4)',
    borderRadius: 20,

  },
});
















// import React, { useState, useEffect } from 'react';

// // Import all required component
// import {

//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TextInput,
//   ScrollView,
//   BackHandler,
//   ImageBackground,
//   Button,
//   PanResponder, Animated,

// } from 'react-native';

// import Contacts2 from 'react-native-contacts';
// import ListItem from './ListItem';
// import background from './bg10.png'
// import { render } from 'react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod';


// class SittingArrangement extends React.Component {


//   state = { pan: new Animated.ValueXY() }


//   componentWillUnmount() {
//     this._panResponder = PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([
//         null, { dx: this.state.pan.x, dy: this.state.pan.y }
//       ])
//     })
//   }






//   render() {

//     // useEffect(() => {
//     //   const backAction = () => {
//     //     props.setShowSittingArrangement(false)
//     //     return true;
//     //   };

//     //   const backHandler = BackHandler.addEventListener(
//     //     "hardwareBackPress",
//     //     backAction
//     //   );

//     //   return () => backHandler.remove();
//     // }, []);


//     <ImageBackground source={background} resizeMode="cover" style={styles.image}>
//       <Animated.View style={{transform:[
//         {translateX:this.state.pan.x},
//         {translateY:this.state.pan.y}
//       ]}}
//       {...this._panResponder.panHandlers}
//       >
//         <View style={styles.view}>
//           {props.inviteList === [] ? <Text style={styles.text}>Hello world</Text>
//             :
//             <Text style={styles.text}>{props.inviteList[0][1]}</Text>
//           }
//         </View>
//       </Animated.View>


//     </ImageBackground>

//   }
// };
// export default SittingArrangement;

// const styles = StyleSheet.create({
//   image: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   view: {
//     height: 100,
//     width: 250,
//     backgroundColor: 'rgba(247, 241, 235, 0.8)',
//     alignItems: 'center',
//     justifyContent: 'center',

//   },
//   text: { color: '#000' },

// });

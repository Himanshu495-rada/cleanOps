import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

function SplashScreen({navigation}) {
  // useEffect(() => {
  // setTimeout(() => {
  //   //navigation.navigate('Login');
  //   navigation.dispatch(StackActions.replace('Login'));
  // }, 3000);
  // }, []);

  const [invalidLogin, setInvalidLogin] = useState(false);
  const [press, setPress] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const moveImg = Animated.timing(moveAnim, {
      toValue: -200,
      duration: 1000,
      useNativeDriver: true,
    });
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    setTimeout(() => {
      Animated.sequence([moveImg, fadeIn]).start();
    }, 3000);
  }, [moveAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/logocleanops.png')}
        style={{
          position: 'absolute',
          transform: [{translateY: moveAnim}],
          width: 170,
          height: 150,
        }}
      />

      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            opacity: 1,
            color: 'black',
            textAlign: 'center',
            marginTop: 100,
          }}>
          WELCOME!
        </Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Username"
            style={styles.input}
            placeholderTextColor={'#D3CDCD'}
          />
        </View>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={'#D3CDCD'}
          />
          <Icon
            name={press ? 'eye-slash' : 'eye'}
            size={20}
            color="#D3CDCD"
            onPress={() => setPress(!press)}
            marginLeft="auto"
            marginRight={10}
          />
        </View>

        {invalidLogin ? (
          <Text style={{color: 'red', marginTop: 10}}>
            Invalid Username or Password
          </Text>
        ) : null}

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.footer}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 10,
          }}>
          Powered By
        </Text>
        <Image
          source={require('../../assets/spoorthy_logo.jpeg')}
          style={styles.footerLogo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
  },
  footerLogo: {
    width: 100,
    height: 40,
  },
  inputBox: {
    marginTop: 30,
    backgroundColor: '#F6F6F6',
    width: 250,
    height: 50,
    borderRadius: 10,
    paddingLeft: 17,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 24,
  },
  loginButton: {
    backgroundColor: '#5084D2',
    width: 150,
    height: 50,
    borderRadius: 10,
    marginTop: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 24,
  },
});

export default SplashScreen;

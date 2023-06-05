import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  AppRegistry,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';

function SplashScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [press, setPress] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  const pb = new PocketBase(REACT_APP_URL);

  async function collectData(): Promise<void> {
    const credentials = await AsyncStorage.getItem('credentials');
    console.log(credentials);
    if (credentials !== null) {
      let {e, p} = JSON.parse(credentials);
      setEmail(e);
      setPassword(p);
      check();
    } else {
      console.log('No credentials found');
    }
  }

  async function check(): Promise<void> {
    let loginStatus = await AsyncStorage.getItem('login');
    if (loginStatus === 'true') {
      let userName = await AsyncStorage.getItem('role');
      if (userName === 'Admin') {
        ToastAndroid.show('Admin', ToastAndroid.SHORT);
        navigation.dispatch(StackActions.replace('Admin'));
      } else if (userName === 'Higher Authority') {
        ToastAndroid.show('Management', ToastAndroid.SHORT);
        navigation.dispatch(StackActions.replace('Admin2'));
      }
    } else {
      console.log('Not logged in');
    }
  }

  async function login(): Promise<void> {
    try {
      await pb.collection('users').authWithPassword(email, password);
      if (pb.authStore.isValid) {
        let userName = pb.authStore.model.username;
        let name = pb.authStore.model.name;
        let role = pb.authStore.model.designation;
        let avtar =
          REACT_APP_URL +
          '/api/files/users/' +
          pb.authStore.model.id +
          '/' +
          pb.authStore.model.avatar;
        setUserData({name: name, role: role, avtar: avtar, username: userName});

        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem(
          'credentials',
          JSON.stringify({e: email, p: password}),
        );
        await AsyncStorage.setItem('login', 'true');
        await AsyncStorage.setItem('role', role);
        ToastAndroid.show('Logged in', ToastAndroid.SHORT);
        check();
      } else {
        setInvalidLogin(true);
        ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
      setInvalidLogin(true);
      ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
    }
  }

  async function getToken(): Promise<void> {
    console.log('Checking token');
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) {
      try {
        let token = await messaging().getToken();
        console.log(token);
        AsyncStorage.setItem('fcmToken', token);
      } catch (err) {
        console.log(err, ' error to fetch token');
      }
    } else {
      console.log('Token available');
    }
  }

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
    collectData();

    let version: number = Number(Platform.Version);
    if (version > 32) {
      console.log('Request permission');
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } else {
      console.log('No permission required');
    }
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    getToken();

    // Register foreground handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let notificationMsg = remoteMessage.notification.title;
      ToastAndroid.show(notificationMsg, ToastAndroid.SHORT);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    AppRegistry.registerComponent('app', () => SplashScreen);

    return unsubscribe;
  }, [moveAnim, fadeAnim]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
        <Text style={styles.title}>WELCOME!</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Username"
            style={styles.input}
            placeholderTextColor={'#D3CDCD'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={'#D3CDCD'}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={press}
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

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered By</Text>
        <Image
          source={require('../../assets/spoorthy_logo.jpeg')}
          style={styles.footerLogo}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    opacity: 1,
    color: 'black',
    textAlign: 'center',
    marginTop: 100,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
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

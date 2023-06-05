import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  AppRegistry,
  PermissionsAndroid,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';

function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [press, setPress] = useState(true);
  const [invalidLogin, setInvalidLogin] = useState(false);

  const pb = new PocketBase(REACT_APP_URL);

  const check = async () => {
    let loginStatus = await AsyncStorage.getItem('login');
    if (loginStatus === 'true') {
      let userName = await AsyncStorage.getItem('username');
      if (userName === 'Admin') {
        ToastAndroid.show('Admin', ToastAndroid.SHORT);
        navigation.navigate('Admin');
      } else if (userName === 'Management') {
        ToastAndroid.show('Management', ToastAndroid.SHORT);
        navigation.navigate('Admin2');
      } else if (userName === 'Admin_2') {
        ToastAndroid.show('Management', ToastAndroid.SHORT);
        navigation.navigate('C2Admin2');
      } else if (userName === 'Management_2') {
        ToastAndroid.show('Management', ToastAndroid.SHORT);
        navigation.navigate('C2Admin2');
      }
    } else {
      console.log('Not logged in');
    }
  };

  const login = async () => {
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
        await AsyncStorage.setItem('username', userName);
        ToastAndroid.show('Logged in', ToastAndroid.SHORT);
        if (userName === 'Admin') {
          ToastAndroid.show('Admin', ToastAndroid.SHORT);
          navigation.navigate('Admin');
        } else if (userName === 'Management') {
          ToastAndroid.show('Management', ToastAndroid.SHORT);
          navigation.navigate('Admin2');
        } else if (userName === 'Admin_2') {
          ToastAndroid.show('Management', ToastAndroid.SHORT);
          navigation.navigate('C2Admin2');
        } else if (userName === 'Management_2') {
          ToastAndroid.show('Management', ToastAndroid.SHORT);
          navigation.navigate('C2Admin2');
        }
      } else {
        setInvalidLogin(true);
        ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
      setInvalidLogin(true);
      ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
    }
  };

  async function collectData() {
    const credentials = await AsyncStorage.getItem('credentials');
    console.log(credentials);
    if (credentials !== null) {
      let {e, p} = JSON.parse(credentials);
      setEmail(e);
      setPassword(p);
    } else {
      console.log('No credentials found');
    }
  }

  async function getToken() {
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
    collectData();

    check();

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
    AppRegistry.registerComponent('app', () => Login);

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ADMIN LOGIN</Text>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/person-circle.jpg')}
            style={styles.icon}
          />
          <TextInput
            placeholder="USERNAME"
            placeholderTextColor="gray"
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../../assets/key.jpg')} style={styles.icon} />
          <TextInput
            placeholder="PASSWORD"
            placeholderTextColor="gray"
            style={styles.input}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={press}
          />
          <Icon
            name={press ? 'eye-slash' : 'eye'}
            size={20}
            color="#333"
            onPress={() => setPress(!press)}
            marginTop={5}
          />
        </View>

        <View>
          {invalidLogin ? (
            <Text style={{color: 'red'}}>Invalid credentials</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.btn} onPress={login}>
          <Text style={{color: 'white'}}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  settings: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 20,
    marginTop: 20,
  },
  formContainer: {
    width: 330,
    height: 330,
    backgroundColor: 'white',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  title: {
    color: 'black',
    fontSize: 30,
    marginBottom: 50,
  },
  inputContainer: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: 180,
    color: 'black',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  btn: {
    backgroundColor: '#E05949',
    width: 250,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
  },
});

export default Login;

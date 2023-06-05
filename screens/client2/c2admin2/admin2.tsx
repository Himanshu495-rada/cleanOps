import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from 'react-native';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import C2Card from '../c2components/card';
import C2Table from '../c2components/table';

function C2Admin2({navigation}) {
  const pb = new PocketBase(REACT_APP_URL);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [avtar, setAvtar] = useState(
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3JTWdSSJKAxIhCznFLmD7Z&ust=1681810602823000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLDk7O7OsP4CFQAAAAAdAAAAABAE',
  );

  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordHigh, setRecordHigh] = useState([]);
  const [recordPending, setRecordPending] = useState([]);
  const [recordResolved, setRecordResolved] = useState([]);
  const [recordInvalid, setRecordInvalid] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [cardClicked1, setCardClicked1] = useState(false);
  const [cardClicked2, setCardClicked2] = useState(false);
  const [cardClicked3, setCardClicked3] = useState(false);
  const [cardClicked4, setCardClicked4] = useState(false);
  const [lstData, setLstData] = useState([]);

  async function collectData() {
    let loginStatus = await AsyncStorage.getItem('login');
    if (loginStatus === 'true') {
      let credentials = await AsyncStorage.getItem('credentials');
      if (credentials !== null) {
        let {e, p} = JSON.parse(credentials);
        await pb.collection('users').authWithPassword(e, p);
        if (pb.authStore.isValid) {
          let name = pb.authStore.model.name;
          let role = pb.authStore.model.designation;
          let avtar =
            REACT_APP_URL +
            '/api/files/users/' +
            pb.authStore.model.id +
            '/' +
            pb.authStore.model.avatar;
          setUserName(name);
          setRole(role);
          setAvtar(avtar);
        }
      }

      const data = await pb
        .collection('issues2')
        .getFullList(200 /* batch size */, {
          sort: '-created',
        });
      //console.log(data);
      setRecords(data);

      const data2 = [];
      const data3 = [];
      const data4 = [];
      const data5 = [];
      const data6 = [];

      for (let i of data) {
        if (i.priority === 'high' && i.status === false) {
          data2.push(i);
        } else if (i.priority === 'normal' && i.status === false) {
          data3.push(i);
        } else if (i.priority === 'invalid' && i.status === true) {
          data4.push(i);
        } else if (i.status === true) {
          data5.push(i);
        }
      }

      for (let i of data) {
        if (i.status === false) {
          data6.push(i);
        }
      }

      setRecordHigh(data2);
      setRecordInvalid(data4);
      setRecordResolved(data5);
      setRecordPending(data6);
    } else {
      console.log('No data found');
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('credentials');
    const tokenID = await AsyncStorage.getItem('fcmTokenID');
    await AsyncStorage.removeItem('fcmTokenID');
    try {
      await pb.collection('tokens2').delete(tokenID);
    } catch {
      console.log('error to delete token');
    }
    ToastAndroid.show('Logged out', ToastAndroid.SHORT);
    navigation.navigate('Login');
  }

  async function submitToken() {
    const token = await AsyncStorage.getItem('fcmToken');
    const data = {
      token: token,
    };
    const record = await pb.collection('tokens2').create(data);
    console.log(record);
    if (record) {
      const tokenID = record.id;
      console.log(tokenID);
      AsyncStorage.setItem('fcmTokenID', tokenID);
      ToastAndroid.show(
        'Notification token added to server',
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show('Error adding token to server', ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    collectData();
    submitToken();
  }, []);
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={collectData} />
        }>
        <ImageBackground
          source={require('../../../assets/header-background.jpg')}
          style={styles.header}>
          <Image source={{uri: avtar}} style={styles.avatar} alt="Profile" />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.role}>{role}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={{color: 'white'}}>LOGOUT</Text>
          </TouchableOpacity>
          <View></View>
        </ImageBackground>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              setLstData(records);
              setCardClicked1(true);
              setCardClicked2(false);
              setCardClicked3(false);
              setCardClicked4(false);
              setCardClicked(true);
            }}>
            <C2Card
              title="Total Issues"
              value={records.length}
              img={require('../../../assets/Box_Important.png')}
              isClicked={cardClicked1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLstData(recordPending);
              setCardClicked2(true);
              setCardClicked1(false);
              setCardClicked3(false);
              setCardClicked4(false);
              setCardClicked(true);
            }}>
            <C2Card
              title="Pending issues"
              value={recordPending.length}
              img={require('../../../assets/Medium_Risk.png')}
              isClicked={cardClicked2}
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              setLstData(recordHigh);
              setCardClicked3(true);
              setCardClicked1(false);
              setCardClicked2(false);
              setCardClicked4(false);
              setCardClicked(true);
            }}>
            <C2Card
              title="High Priority"
              value={recordHigh.length}
              img={require('../../../assets/High_Risk.png')}
              isClicked={cardClicked3}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLstData(recordResolved);
              setCardClicked4(true);
              setCardClicked1(false);
              setCardClicked2(false);
              setCardClicked3(false);
              setCardClicked(true);
            }}>
            <C2Card
              title="Issues Solved"
              value={recordResolved.length}
              img={require('../../../assets/Ok.png')}
              isClicked={cardClicked4}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row2}>
          <TouchableOpacity
            onPress={() => {
              setLstData(recordInvalid);
              setCardClicked(true);
            }}>
            <Text
              style={{
                color: '#0EA6D6',
                textDecorationLine: 'underline',
                marginLeft: 20,
                fontSize: 18,
              }}>
              Invalid Issues: {recordInvalid.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.issueBtn}
            onPress={() => navigation.navigate('C2ReportIssue')}>
            <Text style={{fontSize: 15, color: 'white'}}>REPORT ISSUE</Text>
          </TouchableOpacity>
        </View>

        {cardClicked ? <C2Table data={lstData} /> : <C2Table data={records} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 20,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
  },
  role: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    marginTop: 20,
  },
  logoutBtn: {
    backgroundColor: '#E05949',
    width: 70,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  row2: {
    flexDirection: 'row',
    marginTop: 20,
  },
  reqBtn: {
    backgroundColor: 'green',
    width: '40%',
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
  },
  issueBtn: {
    backgroundColor: '#E05949',
    width: '40%',
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default C2Admin2;

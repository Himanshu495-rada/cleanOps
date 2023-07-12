import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/card';
import Table from '../components/table';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import {Skeleton} from '@rneui/themed';
import FastImage from 'react-native-fast-image';

function Admin({navigation}) {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
  const [issueTable, setIssueTable] = useState('');

  const pb = new PocketBase(REACT_APP_URL);

  async function collectData() {
    let i_table = await AsyncStorage.getItem('issueTable');
    setIssueTable(i_table);
    let loginStatus = await AsyncStorage.getItem('login');
    if (loginStatus === 'true') {
      let credentials = await AsyncStorage.getItem('credentials');
      if (credentials !== null) {
        let {e, p} = JSON.parse(credentials);
        await pb.collection('users').authWithPassword(e, p);
        if (pb.authStore.isValid) {
          let name = pb.authStore.model.name;
          let role = pb.authStore.model.designation;
          setUserName(name);
          setRole(role);
        }
      }

      const data = await pb
        .collection(i_table)
        .getFullList(200 /* batch size */, {
          sort: '-created',
        });

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
      await pb.collection('tokens').delete(tokenID);
    } catch {
      console.log('error to delete token');
    }
    ToastAndroid.show('Logged out', ToastAndroid.SHORT);
    navigation.navigate('Splash');
  }

  async function submitToken() {
    const token = await AsyncStorage.getItem('fcmToken');
    const data = {
      token: token,
    };
    const record = await pb.collection('tokens').create(data);
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
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={logout}>
                <Text style={styles.modalButton}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButton}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={collectData} />
        }
        style={{backgroundColor: 'white'}}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/Administrator_Male.png')}
            style={styles.avatar}
            alt="Profile"
          />
          <Text style={styles.role}>{role}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.logoutBtn}>
            <FastImage
              source={require('../../assets/Logout.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: -50,
            backgroundColor: '#ffffff',
            borderRadius: 10,
          }}>
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
              <Card
                title="Total Issues"
                value={records.length}
                img={require('../../assets/Box_Important.png')}
                isClicked={cardClicked1}
                color="#AFDEF9"
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
              <Card
                title="Pending issues"
                value={recordPending.length}
                img={require('../../assets/Spam.png')}
                isClicked={cardClicked2}
                color="#FDB019C7"
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
              <Card
                title="High Priority"
                value={recordHigh.length}
                img={require('../../assets/High_Priority.png')}
                isClicked={cardClicked3}
                color="#FF6767"
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
              <Card
                title="Issues Solved"
                value={recordResolved.length}
                img={require('../../assets/Checkmark.png')}
                isClicked={cardClicked4}
                color="#80FF9C"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row2}>
          <TouchableOpacity
            onPress={() => {
              setLstData(recordInvalid);
              setCardClicked(true);
            }}>
            <Text
              style={{
                color: '#043767',
                textDecorationLine: 'underline',
                marginLeft: 20,
                fontSize: 16,
              }}>
              Invalid Issues: {recordInvalid.length}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row2}>
          <TouchableOpacity
            style={styles.reqBtn}
            onPress={() => navigation.navigate('RaiseRequest')}>
            <Text style={{fontSize: 15, color: 'white'}}>RAISE REQUEST</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.issueBtn}
            onPress={() => navigation.navigate('ReportIssue')}>
            <Text style={{fontSize: 15, color: 'white'}}>REPORT ISSUE</Text>
          </TouchableOpacity>
        </View>

        {cardClicked ? <Table data={lstData} /> : <Table data={records} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0F175F',
    height: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 25,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  role: {
    fontSize: 32,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginBottom: 40,
    marginRight: 20,
  },
  logoutBtn: {
    marginRight: 20,
    marginBottom: 50,
  },
  row2: {
    marginTop: 20,
    flexDirection: 'row',
  },
  reqBtn: {
    flex: 1,
    backgroundColor: '#043767',
    width: 150,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  issueBtn: {
    flex: 1,
    backgroundColor: '#B2110D',
    width: 150,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  modalButton: {
    fontSize: 16,
    color: 'black',
    marginHorizontal: 10,
  },
});
export default Admin;

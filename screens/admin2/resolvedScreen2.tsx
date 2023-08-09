import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Checkmark from '../../assets/Checkmark.png';
import Back from '../../assets/Back.png';
import FastImage from 'react-native-fast-image';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import CarouselView from '../components/carousel';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ResolvedScreen2({navigation}) {
  const route = useRoute();
  const {data} = route.params;

  const pb = new PocketBase(REACT_APP_URL);
  const popAction = StackActions.pop(1);

  const [issueTable, setIssueTable] = useState('');

  async function collectData() {
    let i_table = await AsyncStorage.getItem('issueTable');
    setIssueTable(i_table);
  }

  async function unresolve() {
    const formData = new FormData();

    formData.append('solution', '');
    formData.append('result', '');
    formData.append('status', false);

    const record = await pb.collection(issueTable).update(data.id, formData);
    if (record) {
      ToastAndroid.show('Issue Unresolved', ToastAndroid.SHORT);
    }
    navigation.navigate('Admin2');
  }

  function back() {
    navigation.dispatch(popAction);
  }

  useEffect(() => {
    collectData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity onPress={back}>
          <FastImage source={Back} style={{width: 50, height: 50}} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Resolved Issue</Text>

        <FastImage
          source={Checkmark}
          style={{width: 40, height: 40, marginLeft: 'auto', marginRight: 20}}
        />
      </View>
      <View
        style={{marginTop: -80, backgroundColor: 'white', borderRadius: 10}}>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <CarouselView data={{images: data.images, id: data.id}} />
        </View>
        <View style={{marginLeft: 20, marginVertical: 20}}>
          <Text style={styles.detailsText}>
            Issue ID :- <Text style={styles.detailsInText}>{data.id}</Text>
          </Text>
          <Text style={styles.detailsText}>
            Priority :-{' '}
            <Text style={styles.detailsInText}>{data.priority}</Text>
          </Text>
          <Text style={styles.detailsText}>
            Category :-{' '}
            <Text style={styles.detailsInText}>{data.category}</Text>
          </Text>
          <Text style={styles.detailsText}>
            Reported on :-{' '}
            <Text style={styles.detailsInText}>
              {data.created.split('.')[0]}
            </Text>
          </Text>
          <Text style={styles.detailsText}>
            Floor :- <Text style={styles.detailsInText}>{data.floor}</Text>
          </Text>
          <Text style={styles.detailsText}>
            Solution :-{' '}
            <Text style={styles.detailsInText}>{data.solution}</Text>
          </Text>
          <Text style={styles.detailsText}>Result Image :- </Text>
          <View style={styles.messageInput}>
            {data.result === '' ? (
              <Text style={{textAlign: 'center'}}>No Result Image</Text>
            ) : (
              <FastImage
                source={{
                  uri:
                    REACT_APP_URL +
                    '/api/files/' +
                    issueTable +
                    '/' +
                    data.id +
                    '/' +
                    data.result,
                }}
                style={{width: 150, height: 150}}
              />
            )}
          </View>
        </View>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Pressable style={styles.submitBtnE} onPress={unresolve}>
          <Text style={{color: 'white', textAlign: 'center'}}>Unresolve</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: 'green',
    height: 150,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    marginTop: 7,
  },
  detailsText: {
    fontSize: 15,
    color: 'black',
    marginTop: 20,
    fontWeight: 'bold',
  },
  detailsInText: {
    fontSize: 15,
    color: 'black',
    marginTop: 20,
    fontWeight: 'normal',
  },
  messageInput: {
    width: '90%',
    height: 150,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnE: {
    width: 150,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default ResolvedScreen2;

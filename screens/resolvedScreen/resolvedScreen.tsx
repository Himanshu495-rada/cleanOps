import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Checkmark from '../../assets/Checkmark.png';
import Back from '../../assets/Back.png';
import FastImage from 'react-native-fast-image';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import CarouselView from '../components/carousel';
import {useRoute} from '@react-navigation/native';

function ResolvedScreen({navigation}) {
  const route = useRoute();
  const {id} = route.params;

  const pb = new PocketBase(REACT_APP_URL);
  const popAction = StackActions.pop(1);

  const [data, setData] = useState({
    id: '',
    created: '',
    description: '',
    status: '',
    floor: '',
    priority: '',
    category: '',
    images: [],
    solution: '',
    result: '',
  });

  async function collectData() {
    let record = await pb.collection('issues').getOne(id);
    setData(record);
    console.log(record);
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
          <CarouselView images={data.images} id={data.id} />
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
                    'http://68.178.168.6:8090' +
                    '/api/files/issues/' +
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
    fontSize: 16,
    color: 'black',
    marginTop: 20,
  },
  detailsInText: {
    fontSize: 14,
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
    borderRadius: 10,
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

export default ResolvedScreen;

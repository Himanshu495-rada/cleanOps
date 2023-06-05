import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import ok from '../../assets/Ok.png';
import FastImage from 'react-native-fast-image';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import CarouselView from '../components/carousel';
import {useRoute} from '@react-navigation/native';

function ResolvedScreen() {
  const route = useRoute();
  const {id} = route.params;
  //const id = 'uuj23mvbdlh0lj1';
  const pb = new PocketBase(REACT_APP_URL);

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
  }

  useEffect(() => {
    collectData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <FastImage source={ok} style={{width: 60, height: 60}} />
        <Text style={styles.headerText}>Resolved Issue</Text>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          marginTop: 10,
        }}
      />
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
          Priority :- <Text style={styles.detailsInText}>{data.priority}</Text>
        </Text>
        <Text style={styles.detailsText}>
          Category :- <Text style={styles.detailsInText}>{data.category}</Text>
        </Text>
        <Text style={styles.detailsText}>
          Reported on :-{' '}
          <Text style={styles.detailsInText}>{data.created.split('.')[0]}</Text>
        </Text>
        <Text style={styles.detailsText}>
          Floor :- <Text style={styles.detailsInText}>{data.floor}</Text>
        </Text>
        <Text style={styles.detailsText}>
          Solution :- <Text style={styles.detailsInText}>{data.solution}</Text>
        </Text>
        <Text style={styles.detailsText}>Result Image :- </Text>
        <View style={styles.messageInput}>
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
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
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

export default ResolvedScreen;

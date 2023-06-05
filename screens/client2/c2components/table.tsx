import React from 'react';
import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import {DataTable} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

function C2Table(props) {
  const navigation = useNavigation();

  async function btnPress(arr, ind) {
    let userName = await AsyncStorage.getItem('username');
    if (arr[ind].status === true) {
      if (userName === 'Admin_2') {
        navigation.navigate('C2ResolvedScreen', {id: arr[ind].id});
      } else if (userName === 'Management_2') {
        navigation.navigate('C2ResolvedScreen2', {id: arr[ind].id});
      }
    } else {
      navigation.navigate('C2IssueScreen', {id: arr[ind].id});
    }
  }

  function click() {
    console.log('clicked');
  }

  return (
    <View style={{marginTop: 20, marginLeft: 20}}>
      <ScrollView horizontal={true}>
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={{marginLeft: 10}}>Images</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title>Floor</DataTable.Title>
            <DataTable.Title>Priority</DataTable.Title>
            <DataTable.Title>Category</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>
          {props.data.map((record, index) => {
            if (record.priority === 'high' && record.status === false) {
              return (
                <DataTable.Row
                  style={{
                    backgroundColor: '#FF3D3D',
                    borderRadius: 15,
                    height: 70,
                  }}
                  key={index}>
                  <Pressable
                    onPress={() => btnPress(props.data, index)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      width: '100%',
                    }}>
                    <DataTable.Cell style={styles.imageCell}>
                      <FastImage
                        source={{
                          uri:
                            'http://68.178.168.6:8090' +
                            '/api/files/issues2/' +
                            record.id +
                            '/' +
                            record.images[0] +
                            '?thumb=100x100',
                        }}
                        style={styles.rowImage}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {record.description === ''
                        ? 'No description'
                        : record.description}
                    </DataTable.Cell>
                    <DataTable.Cell>{record.floor}</DataTable.Cell>
                    <DataTable.Cell>{record.priority}</DataTable.Cell>
                    <DataTable.Cell>{record.category}</DataTable.Cell>
                    <DataTable.Cell>
                      {record.status ? 'Resolved' : 'Pending'}
                    </DataTable.Cell>
                  </Pressable>
                </DataTable.Row>
              );
            } else if (
              record.priority === 'normal' &&
              record.status === false
            ) {
              return (
                <DataTable.Row
                  style={{
                    backgroundColor: '#FFBD3D',
                    borderRadius: 15,
                    height: 70,
                  }}
                  key={index}>
                  <Pressable
                    onPress={() => btnPress(props.data, index)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      width: '100%',
                    }}>
                    <DataTable.Cell style={styles.imageCell}>
                      <FastImage
                        source={{
                          uri:
                            'http://68.178.168.6:8090' +
                            '/api/files/issues2/' +
                            record.id +
                            '/' +
                            record.images[0] +
                            '?thumb=100x100',
                        }}
                        style={styles.rowImage}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {record.description === ''
                        ? 'No description'
                        : record.description}
                    </DataTable.Cell>
                    <DataTable.Cell>{record.floor}</DataTable.Cell>
                    <DataTable.Cell>{record.priority}</DataTable.Cell>
                    <DataTable.Cell>{record.category}</DataTable.Cell>
                    <DataTable.Cell>
                      {record.status ? 'Resolved' : 'Pending'}
                    </DataTable.Cell>
                  </Pressable>
                </DataTable.Row>
              );
            } else if (
              record.priority === 'invalid' &&
              record.status === true
            ) {
              return (
                <DataTable.Row
                  style={{
                    backgroundColor: '#D3CDCD',
                    borderRadius: 15,
                    height: 70,
                  }}
                  key={index}>
                  <Pressable
                    onPress={() => btnPress(props.data, index)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      width: '100%',
                    }}>
                    <DataTable.Cell style={styles.imageCell}>
                      <FastImage
                        source={{
                          uri:
                            'http://68.178.168.6:8090' +
                            '/api/files/issues2/' +
                            record.id +
                            '/' +
                            record.images[0] +
                            '?thumb=100x100',
                        }}
                        style={styles.rowImage}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {record.description === ''
                        ? 'No description'
                        : record.description}
                    </DataTable.Cell>
                    <DataTable.Cell>{record.floor}</DataTable.Cell>
                    <DataTable.Cell>{record.priority}</DataTable.Cell>
                    <DataTable.Cell>{record.category}</DataTable.Cell>
                    <DataTable.Cell>
                      {record.status ? 'Resolved' : 'Pending'}
                    </DataTable.Cell>
                  </Pressable>
                </DataTable.Row>
              );
            } else if (record.status === true) {
              return (
                <DataTable.Row
                  style={{
                    backgroundColor: 'green',
                    borderRadius: 15,
                    height: 70,
                  }}
                  key={index}>
                  <Pressable
                    onPress={() => btnPress(props.data, index)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      width: '100%',
                    }}>
                    <DataTable.Cell style={styles.imageCell}>
                      <FastImage
                        source={{
                          uri:
                            'http://68.178.168.6:8090' +
                            '/api/files/issues2/' +
                            record.id +
                            '/' +
                            record.images[0] +
                            '?thumb=100x100',
                        }}
                        style={styles.rowImage}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {record.description === ''
                        ? 'No description'
                        : record.description}
                    </DataTable.Cell>
                    <DataTable.Cell>{record.floor}</DataTable.Cell>
                    <DataTable.Cell>{record.priority}</DataTable.Cell>
                    <DataTable.Cell>{record.category}</DataTable.Cell>
                    <DataTable.Cell>
                      {record.status ? 'Resolved' : 'Pending'}
                    </DataTable.Cell>
                  </Pressable>
                </DataTable.Row>
              );
            }
          })}
        </DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    width: 700,
  },
  tableHeader: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 15,
  },
  imageCell: {
    marginLeft: 10,
  },
  rowImage: {
    width: 60,
    height: 60,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
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
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    marginBottom: 20,
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
  addImageView: {
    width: '90%',
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default C2Table;

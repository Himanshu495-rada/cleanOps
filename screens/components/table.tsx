import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_URL} from '@env';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

function TableRow({image, title, time, description, color}) {
  const renderLimitedText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    } else {
      return text.slice(0, limit) + '...';
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: color,
        marginTop: 10,
        margin: 10,
        padding: 10,
        borderRadius: 10,
      }}>
      <FastImage source={{uri: image}} style={styles.issueImage} />
      <View style={styles.issueInfo}>
        <Text style={styles.issueTitle}>{title}</Text>
        <Text style={styles.issueText}>{time}</Text>
        <Text style={styles.issueText}>
          {renderLimitedText(description, 30)}
        </Text>
      </View>
    </View>
  );
}

function Table(props) {
  const navigation = useNavigation();
  const [issueTable, setIssueTable] = useState('');

  async function btnPress(arr, ind) {
    console.log(arr[ind]);
    let userName = await AsyncStorage.getItem('role');
    if (arr[ind].status === true) {
      if (userName === 'Admin') {
        navigation.navigate('ResolvedScreen', {data: arr[ind]});
      } else if (userName === 'Higher Authority') {
        navigation.navigate('ResolvedScreen2', {data: arr[ind]});
      }
    } else {
      navigation.navigate('IssueScreen', {data: arr[ind]});
    }
  }

  function getResoledTime(created, updated) {
    let created_d = new Date(created);
    let updated_d = new Date(updated);
    if (created_d.getFullYear() === updated_d.getFullYear()) {
      if (created_d.getMonth() === updated_d.getMonth()) {
        if (created_d.getDate() === updated_d.getDate()) {
          return (
            (updated_d.getHours() - created_d.getHours()).toString() +
            ' hours ' +
            (updated_d.getMinutes() - created_d.getMinutes()).toString() +
            ' minutes'
          );
        } else {
          return (
            (updated_d.getDate() - created_d.getDate()).toString() + ' days'
          );
        }
      } else {
        return (
          (updated_d.getMonth() - created_d.getMonth()).toString() + ' months'
        );
      }
    } else {
      return (
        (updated_d.getFullYear() - created_d.getFullYear()).toString() +
        ' years'
      );
    }
  }

  async function getIssueTable() {
    let i_table = await AsyncStorage.getItem('issueTable');
    console.log(i_table);
    setIssueTable(i_table);
  }

  useEffect(() => {
    getIssueTable();
  }, []);

  return (
    <View style={{marginTop: 20}}>
      <ScrollView>
        {props.data.map((record, index) => {
          if (record.priority === 'high' && record.status === false) {
            return (
              <TouchableOpacity
                onPress={() => btnPress(props.data, index)}
                key={index}>
                <TableRow
                  image={
                    REACT_APP_URL +
                    '/api/files/' +
                    issueTable +
                    '/' +
                    record.id +
                    '/' +
                    record.images[0] +
                    '?thumb=100x100'
                  }
                  title={record.floor}
                  time={record.created.split('.')[0]}
                  description={
                    record.description === ''
                      ? 'No description'
                      : record.description
                  }
                  color={'red'}
                />
              </TouchableOpacity>
            );
          } else if (record.priority === 'normal' && record.status === false) {
            return (
              <TouchableOpacity
                onPress={() => btnPress(props.data, index)}
                key={index}>
                <TableRow
                  image={
                    REACT_APP_URL +
                    '/api/files/' +
                    issueTable +
                    '/' +
                    record.id +
                    '/' +
                    record.images[0] +
                    '?thumb=100x100'
                  }
                  title={record.floor}
                  time={record.created.split('.')[0]}
                  description={
                    record.description === ''
                      ? 'No description'
                      : record.description
                  }
                  color={'#FDB019C7'}
                />
              </TouchableOpacity>
            );
          } else if (record.priority === 'invalid' && record.status === true) {
            return (
              <TouchableOpacity
                onPress={() => btnPress(props.data, index)}
                key={index}>
                <TableRow
                  image={
                    REACT_APP_URL +
                    '/api/files/' +
                    issueTable +
                    '/' +
                    record.id +
                    '/' +
                    record.images[0] +
                    '?thumb=100x100'
                  }
                  title={record.floor}
                  time={record.created.split('.')[0]}
                  description={
                    record.description === ''
                      ? 'No description'
                      : record.description
                  }
                  color={'#949494'}
                />
              </TouchableOpacity>
            );
          } else if (record.status === true) {
            return (
              <TouchableOpacity
                onPress={() => btnPress(props.data, index)}
                key={index}>
                <TableRow
                  image={
                    REACT_APP_URL +
                    '/api/files/' +
                    issueTable +
                    '/' +
                    record.id +
                    '/' +
                    record.images[0] +
                    '?thumb=100x100'
                  }
                  title={record.floor}
                  time={
                    'Resolved in ' +
                    getResoledTime(
                      record.created.split('.')[0],
                      record.updated.split('.')[0],
                    )
                  }
                  description={
                    record.description === ''
                      ? 'No description'
                      : record.description
                  }
                  color={'#80FF9C'}
                />
              </TouchableOpacity>
            );
          }
        })}
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
  issueImage: {
    width: 50,
    height: 50,
  },
  issueInfo: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  issueText: {
    fontSize: 14,
    color: 'black',
  },
});

export default Table;

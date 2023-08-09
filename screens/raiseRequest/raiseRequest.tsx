import React, {useEffect, useState} from 'react';
import {StackActions} from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  PermissionsAndroid,
  ToastAndroid,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import uploadingAnimation from '../../assets/uploading.json';
import doneAnimation from '../../assets/done.json';
import LottieView from 'lottie-react-native';
import Back from '../../assets/Back.png';
import Requirement from '../../assets/Requirement.png';

function RaiseRequest({navigation}) {
  const c = ['electrical', 'cleaning', 'civil', 'others'];
  const popAction = StackActions.pop(1);

  const [modalVisible3, setModalVisible3] = useState(false);
  const handleModalShow3 = () => setModalVisible3(true);
  const handleModalHide3 = () => setModalVisible3(false);

  const [modalVisible4, setModalVisible4] = useState(false);
  const handleModalShow4 = () => setModalVisible4(true);
  const handleModalHide4 = () => setModalVisible4(false);

  const [selectedOption2, setSelectedOption2] = useState(null);
  const [message, setMessage] = useState('');
  const [floor, setFloor] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [category, setCategory] = useState('others');
  const pb = new PocketBase(REACT_APP_URL);

  const options2 = [
    {id: 1, label: 'Electrical'},
    {id: 2, label: 'Cleaning'},
    {id: 3, label: 'Civil'},
    {id: 4, label: 'Others'},
  ];

  const cameraOptions = {
    saveToPhotos: true,
    mediaType: 'photo',
    quality: 0.5,
  };

  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(cameraOptions);
      if (!result.cancelled) {
        const imageUri = result.assets[0].uri;
        console.log(result);
        setSelectedImages([...selectedImages, imageUri]);
      }
    }
  };

  const galleryOptions = {
    selectionLimit: 5,
    mediaType: 'photo',
    quality: 0.5,
  };

  const openGallery = async () => {
    console.log('gallery');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchImageLibrary(galleryOptions);
      if (!result.cancelled) {
        let arr = [];
        result.assets.forEach(item => {
          arr.push(item.uri);
        });
        console.log(result);
        setSelectedImages([...selectedImages, ...arr]);
      }
    }
  };

  async function pushNotify() {
    const response = await fetch('http://68.178.168.6:8080/notify');
    const data = response.text();
    console.log(data);
  }

  async function submit() {
    let formData = new FormData();
    formData.append('description', message);
    formData.append('status', false);
    formData.append('floor', floor);
    formData.append('priority', 'high');
    formData.append('category', category);
    selectedImages.forEach((item, index) => {
      formData.append('images', {
        name: `image${index}.jpg`,
        type: 'image/jpeg',
        uri: item,
      });
    });
    handleModalShow3();
    console.log(formData);
    const record = await pb.collection('issues').create(formData);
    console.log(record);
    if (record) {
      pushNotify();
      handleModalHide3();
      handleModalShow4();
      setTimeout(() => {
        handleModalHide4();
      }, 3000);
      ToastAndroid.show('Issue Reported', ToastAndroid.SHORT);
      setMessage('');
      setFloor('');
      setSelectedImages([]);
    }
  }
  function back() {
    navigation.dispatch(popAction);
  }

  const handleOptionSelect2 = id => {
    setSelectedOption2(id);
    setCategory(c[id - 1]);
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={back}>
          <FastImage source={Back} style={{width: 50, height: 50}} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Report Issue</Text>
        <FastImage
          source={Requirement}
          style={{
            width: 40,
            height: 40,
            marginLeft: 'auto',
            marginRight: 20,
            marginTop: 12,
          }}
        />
      </View>

      <View
        style={{
          marginTop: -80,
          backgroundColor: 'white',
          borderRadius: 10,
          height: '90%',
        }}>
        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={{color: 'black'}}>
            Request the things/issue to the management.
          </Text>
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 20,
            flexDirection: 'row',
          }}>
          <Text style={styles.detailsText}>
            Department<Text style={{color: 'red'}}>*</Text> :-
          </Text>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  width: 120,
                }}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption2 === 1 && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect2(1)}
                />
                <Text style={styles.optionLabel}>Electrical</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  width: 120,
                }}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption2 === 2 && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect2(2)}
                />
                <Text style={styles.optionLabel}>Cleaning</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  width: 120,
                }}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption2 === 3 && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect2(3)}
                />
                <Text style={styles.optionLabel}>Civil</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  width: 120,
                }}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption2 === 4 && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect2(4)}
                />
                <Text style={styles.optionLabel}>Others</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.detailsText}>
            Description<Text style={{color: 'red'}}>*</Text> :-{' '}
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            placeholder="Write detailed description of the issue and help our admin to resolve..."
            textAlign="center"
            placeholderTextColor="gray"
            style={styles.messageInput}
            onChangeText={text => setMessage(text)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
          }}>
          {/* {message != '' || selectedImages.length > 0 ? (
            <Pressable style={styles.submitBtnE} onPress={submit}>
              <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.submitBtnD}>
              <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
            </Pressable>
          )} */}
          <Pressable style={styles.submitBtnD}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </Pressable>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible3}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <LottieView
                source={uploadingAnimation}
                autoPlay
                loop
                style={{height: 300}}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalVisible4}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <LottieView
                source={doneAnimation}
                autoPlay
                loop
                style={{height: 300}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#043767',
    height: 150,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    marginTop: 8,
  },
  detailsText: {
    fontSize: 16,
    color: 'black',
  },
  detailsInText: {
    fontSize: 15,
    color: 'black',
    marginTop: 20,
    fontWeight: 'normal',
  },
  messageInput: {
    width: '90%',
    height: 250,
    borderWidth: 1,
    borderColor: '#949494',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    borderRadius: 10,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  submitBtnE: {
    width: 150,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  submitBtnD: {
    width: 150,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  input: {
    width: 150,
    backgroundColor: 'white',
    marginLeft: 10,
    color: 'black',
    borderBottomWidth: 1,
    marginTop: -15,
  },
  uploadImage: {
    marginLeft: 20,
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#949494',
    borderRadius: 10,
  },
  uploadIcons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  optionLabel: {
    marginLeft: 2,
    color: 'black',
  },
  selectedOption: {
    backgroundColor: 'green',
  },
});

export default RaiseRequest;

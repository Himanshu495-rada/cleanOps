import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import uploadingAnimation from '../../../assets/uploading.json';
import doneAnimation from '../../../assets/done.json';
import LottieView from 'lottie-react-native';
import ModalDropdown from 'react-native-modal-dropdown';

function C2ReportIssue() {
  const [modalVisible3, setModalVisible3] = useState(false);
  const handleModalShow3 = () => setModalVisible3(true);
  const handleModalHide3 = () => setModalVisible3(false);

  const [modalVisible4, setModalVisible4] = useState(false);
  const handleModalShow4 = () => setModalVisible4(true);
  const handleModalHide4 = () => setModalVisible4(false);

  const [message, setMessage] = useState('');
  const [floor, setFloor] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [category, setCategory] = useState('others');
  const pb = new PocketBase(REACT_APP_URL);

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
    const response = await fetch('http://68.178.168.6:8080/notify2');
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
    const record = await pb.collection('issues2').create(formData);
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

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerText}>REPORT A PROBLEM</Text>
      </View>
      <View style={{marginHorizontal: 20}}>
        <Text style={{color: 'black'}}>
          Capture/Upload the images of the scene where you found the problem,
          and describe the problem, we will rectify it as soon as possible and
          upload it in our page.
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          marginTop: 10,
        }}
      />
      <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
        <Text style={styles.detailsText}>Floor :- </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Floor Name"
          placeholderTextColor="gray"
          onChangeText={text => setFloor(text)}
        />
      </View>
      <View
        style={{
          marginLeft: 20,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.detailsText}>Category :- </Text>
        <SelectDropdown
          data={['cleaning', 'electrical', 'civil', 'others']}
          onSelect={(index, value) => {
            setCategory(value);
          }}
          defaultValue={category}
          buttonStyle={{
            backgroundColor: 'white',
            width: 100,
            height: 30,
            borderRadius: 15,
            borderWidth: 1,
            marginRight: 10,
            marginTop: 20,
          }}
        />
      </View>
      <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
        <Text style={styles.detailsText}>Image :- </Text>
      </View>
      <View style={styles.uploadImage}>
        <Text
          style={{
            color: 'black',
            marginLeft: 10,
            marginTop: 10,
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
          <Text style={{color: 'red'}}>*</Text> UPLOAD IMAGE
          <Text style={{color: 'gray'}}> MAX UPTO 5 IMAGES</Text>
        </Text>
        {selectedImages.length < 5 ? (
          <View style={{flexDirection: 'row'}}>
            <Pressable style={styles.uploadIcons} onPress={openCamera}>
              <Icon name="camera" size={35} color="gray" />
              <Text style={{color: 'gray'}}>Capture</Text>
            </Pressable>
            <Text>OR</Text>
            <Pressable style={styles.uploadIcons} onPress={openGallery}>
              <Icon name="folder" size={35} color="gray" />
              <Text style={{color: 'gray'}}>Upload</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={{flexDirection: 'row'}}>
          {selectedImages &&
            selectedImages.map((item, index) => {
              return (
                <View key={index} style={{margin: 5}}>
                  <FastImage
                    source={{uri: item}}
                    style={{width: 50, height: 80}}
                  />
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'red',
                      borderRadius: 50,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      let arr = selectedImages;
                      arr.splice(index, 1);
                      setSelectedImages([...arr]);
                    }}>
                    <Icon name="close" size={15} color="white" />
                  </Pressable>
                </View>
              );
            })}
        </View>
      </View>
      <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
        <Text style={styles.detailsText}>Description :- </Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          placeholder="Describe the problem here..."
          textAlign="center"
          placeholderTextColor="gray"
          style={styles.messageInput}
          onChangeText={text => setMessage(text)}
        />
      </View>

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {message != '' || selectedImages.length > 0 ? (
          <Pressable style={styles.submitBtnE} onPress={submit}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.submitBtnD}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </Pressable>
        )}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
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
    color: 'black',
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
  submitBtnD: {
    width: 150,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  input: {
    width: 150,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 10,
    color: 'black',
  },
  uploadImage: {
    marginLeft: 20,
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default C2ReportIssue;

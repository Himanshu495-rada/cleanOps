import React, {useEffect, useState} from 'react';
import {useRoute, StackActions} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Pressable,
  Modal,
  ToastAndroid,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FastImage from 'react-native-fast-image';
import headerImage from '../../assets/Red_Risk.png';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import CarouselView from '../components/carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import uploadingAnimation from '../../assets/uploading.json';
import doneAnimation from '../../assets/done.json';
import LottieView from 'lottie-react-native';

function IssueScreen({navigation}) {
  const popAction = StackActions.pop(1);
  const route = useRoute();
  const {id} = route.params;
  //const id = 'ialjqrw64603tgw';
  const pb = new PocketBase(REACT_APP_URL);
  const p = ['high', 'normal', 'invalid'];
  const c = ['others', 'electrical', 'civil', 'cleaning'];

  const [modalVisible3, setModalVisible3] = useState(false);
  const handleModalShow3 = () => setModalVisible3(true);
  const handleModalHide3 = () => setModalVisible3(false);

  const [modalVisible4, setModalVisible4] = useState(false);
  const handleModalShow4 = () => setModalVisible4(true);
  const handleModalHide4 = () => setModalVisible4(false);

  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [category, setCategory] = useState('');
  const [data, setData] = useState({
    id: '',
    created: '',
    description: '',
    status: '',
    floor: '',
    priority: '',
    category: category,
    images: [],
  });
  const [priority, setPriority] = useState('');

  async function collectData() {
    let record = await pb.collection('issues').getOne(id);
    setData(record);
  }

  const handleMessageChange = e => {
    setMessage(e.target.value);
  };

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
        console.log(result);
        const imageUri = result.assets[0].uri;
        console.log(imageUri);
        setSelectedImages([imageUri]);
      }
    }
  };

  const galleryOptions = {
    selectionLimit: 1,
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
        setSelectedImages(arr);
      }
    }
  };

  async function pushNotify() {
    const response = await fetch('http://68.178.168.6:8080/resolved');
    const data = response.text();
    console.log(data);
  }

  async function submit() {
    const formData = new FormData();

    formData.append('solution', message);
    if (selectedImages != '') {
      formData.append('result', {
        name: `image${0}.jpg`,
        type: 'image/jpeg',
        uri: selectedImages[0],
      });
    }
    if (priority != '') {
      formData.append('priority', p[parseInt(priority)]);
    } else {
      formData.append('priority', data.priority);
    }
    if (category != '') {
      console.log('Yes');
      console.log(c[parseInt(category)]);
      formData.append('category', c[parseInt(category)]);
    } else {
      formData.append('category', data.category);
    }

    formData.append('status', true);
    console.log(formData);
    console.log(data.category);

    handleModalShow3();

    const record = await pb.collection('issues').update(data.id, formData);
    if (record) {
      pushNotify();
      handleModalHide3();
      handleModalShow4();
      setTimeout(() => {
        handleModalHide4();
      }, 3000);
      navigation.dispatch(popAction);
    }
  }

  async function save() {
    const formData = new FormData();

    if (priority != '') {
      formData.append('priority', p[parseInt(priority)]);
    } else {
      formData.append('priority', data.priority);
    }
    if (category != '') {
      formData.append('category', c[parseInt(category)]);
    } else {
      formData.append('category', data.category);
    }
    console.log(formData);
    const record = await pb.collection('issues').update(data.id, formData);
    if (record) {
      ToastAndroid.show('Issue Updated', ToastAndroid.SHORT);
      navigation.dispatch(popAction);
    } else {
      ToastAndroid.show('Issue not Updated', ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    collectData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <FastImage source={headerImage} style={{width: 60, height: 60}} />
        <Text style={styles.headerText}>Issue Tracker</Text>
      </View>
      <View style={{marginHorizontal: 20}}>
        <Text style={{color: 'black'}}>
          Track the issues based on images and description reported, resolve and
          upload the photo of the same
        </Text>
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
      <View style={{marginLeft: 20, marginTop: 20}}>
        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.detailsText}>
            Issue ID :- <Text style={styles.detailsInText}>{data.id}</Text>
          </Text>
        </View>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.detailsText}>
            Description :-{' '}
            <Text style={styles.detailsInText}>{data.description}</Text>
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.detailsText}>Priority :-</Text>
          <SelectDropdown
            data={p}
            onSelect={(index, value) => setPriority(value)}
            defaultButtonText={data.priority}
            buttonStyle={{
              backgroundColor: 'white',
              width: 100,
              height: 30,
              borderRadius: 15,
              borderWidth: 1,
              marginRight: 10,
            }}
          />
        </View>

        <View
          style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.detailsText}>Category :- </Text>
          <SelectDropdown
            data={c}
            onSelect={(index, value) => setCategory(value)}
            defaultButtonText={data.category}
            buttonStyle={{
              backgroundColor: 'white',
              width: 120,
              height: 30,
              borderRadius: 15,
              borderWidth: 1,
              marginRight: 10,
            }}
          />
        </View>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.detailsText}>
            Reported on :-{' '}
            <Text style={styles.detailsInText}>
              {data.created.split('.')[0]}
            </Text>
          </Text>
        </View>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.detailsText}>
            Floor :- <Text style={styles.detailsInText}>{data.floor}</Text>
          </Text>
        </View>

        <Text
          style={{
            fontSize: 15,
            color: 'black',
            fontWeight: 'bold',
            marginTop: 20,
          }}>
          Solution :-{' '}
        </Text>
        <TextInput
          placeholder="Enter the solution"
          textAlign="center"
          placeholderTextColor="gray"
          style={styles.messageInput}
          onChangeText={text => setMessage(text)}
        />
        <Text
          style={{
            fontSize: 15,
            color: 'black',
            fontWeight: 'bold',
            marginTop: 20,
          }}>
          Result Image :-{' '}
        </Text>
        <View style={styles.messageInput}>
          <Pressable onPress={openCamera}>
            {selectedImages != '' ? (
              <View>
                <Icon
                  name="close"
                  size={20}
                  color="red"
                  onPress={() => setSelectedImages('')}
                  style={{position: 'absolute', left: 80, top: 0}}
                />
                <FastImage
                  source={{uri: selectedImages[0]}}
                  style={{width: 70, height: 70}}
                />
              </View>
            ) : (
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
            )}
          </Pressable>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {(priority != '' || category != '') &&
          (message === '' || selectedImages === '') ? (
            <Pressable style={styles.submitBtnE} onPress={save}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.submitBtnD}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          )}
          {message != '' && selectedImages != '' ? (
            <Pressable style={styles.submitBtnE} onPress={submit}>
              <Text style={styles.btnText}>Resolve</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.submitBtnD}>
              <Text style={styles.btnText}>Resolve</Text>
            </Pressable>
          )}
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
    marginTop: 5,
  },
  detailsText: {
    fontSize: 15,
    color: 'black',
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
    marginRight: 20,
  },
  submitBtnD: {
    width: 150,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginRight: 20,
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
  uploadIcons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default IssueScreen;

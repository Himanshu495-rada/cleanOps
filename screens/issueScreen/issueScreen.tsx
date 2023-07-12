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
  TouchableOpacity,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FastImage from 'react-native-fast-image';
import PocketBase from 'pocketbase';
import {REACT_APP_URL} from '@env';
import CarouselView from '../components/carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import uploadingAnimation from '../../assets/uploading.json';
import doneAnimation from '../../assets/done.json';
import LottieView from 'lottie-react-native';
import Back from '../../assets/Back.png';
import High_Priority from '../../assets/High_Priority.png';

function IssueScreen({navigation}) {
  const popAction = StackActions.pop(1);
  const route = useRoute();
  const {id} = route.params;
  //const id = 'ialjqrw64603tgw';
  const pb = new PocketBase(REACT_APP_URL);
  const p = ['high', 'normal', 'invalid'];
  const c = ['electrical', 'cleaning', 'civil', 'others'];

  const [modalVisible3, setModalVisible3] = useState(false);
  const handleModalShow3 = () => setModalVisible3(true);
  const handleModalHide3 = () => setModalVisible3(false);

  const [modalVisible4, setModalVisible4] = useState(false);
  const handleModalShow4 = () => setModalVisible4(true);
  const handleModalHide4 = () => setModalVisible4(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
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

  const options = [
    {id: 1, label: 'High'},
    {id: 2, label: 'Normal'},
    {id: 3, label: 'Invalid'},
  ];

  const options2 = [
    {id: 1, label: 'Electrical'},
    {id: 2, label: 'Cleaning'},
    {id: 3, label: 'Civil'},
    {id: 4, label: 'Others'},
  ];

  const handleOptionSelect = id => {
    setSelectedOption(id);
    setPriority(id - 1);
  };

  const handleOptionSelect2 = id => {
    setSelectedOption2(id);
    setCategory(id - 1);
    console.log(id - 1);
  };

  async function collectData() {
    let record = await pb.collection('issues').getOne(id);
    setData(record);
    setSelectedOption(p.indexOf(record.priority) + 1);
    setSelectedOption2(c.indexOf(record.category) + 1);
    console.log(c.indexOf(record.category) + 1);
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

  function back() {
    navigation.dispatch(popAction);
  }

  useEffect(() => {
    collectData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Pressable onPress={back}>
          <FastImage source={Back} style={{width: 50, height: 50}} />
        </Pressable>
        <View>
          <Text style={styles.headerText}>{data.floor}</Text>
          <Text style={{color: 'white', marginLeft: 10}}>{data.id}</Text>
        </View>
        <FastImage
          source={High_Priority}
          style={{
            width: 40,
            height: 40,
            marginLeft: 'auto',
            marginRight: 20,
            marginTop: 10,
          }}
        />
      </View>
      <View
        style={{
          marginTop: -80,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <CarouselView images={data.images} id={data.id} />
          <View style={{marginHorizontal: 20}}>
            <Text style={{color: 'black', fontSize: 14, marginTop: 10}}>
              {data.description}
            </Text>
            <Text style={{color: 'black', fontSize: 14, marginTop: 5}}>
              Reported on {data.created.split('.')[0]}
            </Text>
          </View>
        </View>
        <View style={{marginLeft: 20, marginTop: 10}}>
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <Text style={styles.detailsText}>
              Priority<Text style={{color: 'red', fontSize: 16}}>*</Text>:-{' '}
              {options.map(option => (
                <View
                  key={option.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      selectedOption === option.id && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionSelect(option.id)}
                  />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
              ))}
            </Text>
          </View>

          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <Text style={styles.detailsText}>
              Category<Text style={{color: 'red', fontSize: 16}}>*</Text>:-{' '}
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

          <Text
            style={{
              fontSize: 15,
              color: 'black',
              marginTop: 20,
            }}>
            Add Photos<Text style={{color: 'red'}}>*</Text> :-
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

          <Text
            style={{
              fontSize: 15,
              color: 'black',
              fontWeight: 'bold',
              marginTop: 20,
            }}>
            Solution<Text style={{color: 'red'}}>*</Text> :-
          </Text>
          <TextInput
            placeholder="Write the solution for resolving this issue."
            textAlign="center"
            placeholderTextColor="gray"
            style={styles.messageInput}
            onChangeText={text => setMessage(text)}
          />

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
    backgroundColor: '#FF6767',
    height: 150,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
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
    height: 150,
    borderWidth: 1,
    borderColor: '#949494',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
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
  },
  selectedOption: {
    backgroundColor: 'green',
  },
});

export default IssueScreen;

import React, {useState} from 'react';
import Carousel from 'react-native-snap-carousel';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Close from '../../assets/Close.png';

function CarouselView(props) {
  let images = props.images;

  const [modalVisible, setModalVisible] = useState(false);
  const handleModalShow = () => setModalVisible(true);
  const handleModalHide = () => setModalVisible(false);

  const [modalImage, setModalImage] = useState('');

  function handleModalImageChange(image) {
    setModalImage(image);
    handleModalShow();
  }

  return (
    <>
      <Carousel
        layout={'default'}
        data={images}
        sliderWidth={400}
        itemWidth={370}
        renderItem={({item, index}) => (
          <Pressable
            style={styles.img}
            onPress={() =>
              handleModalImageChange(
                'http://68.178.168.6:8090' +
                  '/api/files/issues/' +
                  props.id +
                  '/' +
                  item,
              )
            }>
            <FastImage
              source={{
                uri:
                  'http://68.178.168.6:8090' +
                  '/api/files/issues/' +
                  props.id +
                  '/' +
                  item,
              }}
              style={{width: 150, height: 150}}
            />
          </Pressable>
        )}
        loop={true}
        autoplay={true}
        autoplayInterval={3000}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <TouchableOpacity onPress={handleModalHide}>
                <FastImage source={Close} style={styles.closeBtn} />
              </TouchableOpacity>
              <FastImage
                source={{
                  uri: modalImage,
                }}
                style={{
                  width: 300,
                  height: 300,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
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
  closeBtn: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
    marginTop: 10,
    marginRight: -20,
  },
});
export default CarouselView;

import React, {useState} from 'react';
import Carousel from 'react-native-snap-carousel';
import {View, StyleSheet, Modal, Pressable, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            {/* <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={handleModalHide}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 30,
                      right: 0,
                      top: 0,
                    }}>
                    x
                  </Text>
                </Pressable>
              </View>
            </View> */}
            <View>
              <Pressable onPress={handleModalHide}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 30,
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  x
                </Text>
              </Pressable>
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
    borderColor: 'black',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
export default CarouselView;

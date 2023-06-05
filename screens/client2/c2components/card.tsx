import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function C2Card(props) {
  return (
    <View
      style={{
        width: 170,
        height: 150,
        borderWidth: 2,
        borderColor: props.isClicked ? 'blue' : 'white',
        borderRadius: 10,
        marginTop: 30,
        padding: 10,
        margin: 8,
      }}>
      <View style={styles.cardRow1}>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            textAlignVertical: 'center',
            width: 70,
          }}>
          {props.title}
        </Text>
        <Image source={props.img} style={{height: 40, width: 40}} />
      </View>
      <Text style={{color: 'black', fontSize: 35, padding: 10}}>
        {props.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 150,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    marginTop: 30,
    padding: 10,
    margin: 8,
  },
  cardClicked: {
    width: 170,
    height: 150,
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 10,
    marginTop: 30,
    padding: 10,
    margin: 8,
  },
  cardShadow: {
    shadowColor: 'black',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  cardRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
});

export default C2Card;

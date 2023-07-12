import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function Card(props) {
  return (
    <View
      style={{
        width: 180,
        height: 110,
        borderWidth: 2,
        borderColor: props.isClicked ? 'blue' : 'white',
        borderRadius: 10,
        marginTop: 30,
        padding: 10,
        margin: 8,
        backgroundColor: props.color,
      }}>
      <View style={styles.iconContainer}>
        <Image
          source={props.img}
          style={{
            height: 30,
            width: 30,
            position: 'absolute',
            marginLeft: 'auto',
          }}
        />
      </View>
      <View>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 40,
            padding: 10,
            textAlign: 'center',
          }}>
          {props.value}
        </Text>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
            textAlign: 'center',
            marginTop: -13,
          }}>
          {props.title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});

export default Card;

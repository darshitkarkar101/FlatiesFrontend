/**
 * @author : Darshit Karkar
 * @description : Logo component
 * @param : props
 * @returns : Logo component
 * @university : University of Regina
 */
import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../../assets/images/FlateMate.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
})

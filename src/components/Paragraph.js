/**
 * @author : Darshit Karkar
 * @description : Paragraph component
 * @param : props
 * @returns : Paragraph component
 * @university : University of Regina
 */
import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

export default function Paragraph(props) {
  return <Text style={styles.text} {...props} />
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
})

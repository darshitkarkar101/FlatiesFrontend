/**
 * @author : Darshit Karkar
 * @description : theme component
 * @param : props
 * @returns : theme component
 * @university : University of Regina
 */
import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#557C93',
    secondary: '#414757',
    error: '#f13a59',
  },
}

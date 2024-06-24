/**
 * @author : Darshit Karkar
 * @description : emailValidator component
 * @param : props
 * @returns : emailValidator component
 * @university : University of Regina
 */

export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty."
  if (!re.test(email)) return 'Ooops! We need a valid email address.'
  return ''
}

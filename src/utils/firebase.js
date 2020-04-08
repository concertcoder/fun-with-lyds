import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyBJtnVJB15IgedHZdcShZWz5GOwyrFRssk',
  databaseURL: 'https://fun-with-lyds.firebaseio.com/',
  projectId: 'fun-with-lyds'
})

export const firestore = firebase.firestore()

export const firestoreCollections = {
  threadRef: firestore.collection('threads'),
  messagesRef: firestore.collection('messages')
}

export default firebase

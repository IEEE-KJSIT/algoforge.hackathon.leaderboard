import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Get this from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAj5-xydbxBz-EodT82TXmw3wfSWJuZ6zs",
  authDomain: "algoforge-hackathon.firebaseapp.com",
  projectId: "algoforge-hackathon",
  storageBucket: "algoforge-hackathon.appspot.com",
  messagingSenderId: "1071453789018",
  appId: "1:1071453789018:web:e6a9b2c64ce770b1b21019"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 
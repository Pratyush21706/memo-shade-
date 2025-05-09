import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-Euqpq0HC0IebmfcRmVJz4gTYGlcowYg",
  authDomain: "memo-shade.firebaseapp.com",
  databaseURL: "https://memo-shade-default-rtdb.firebaseio.com",
  projectId: "memo-shade",
  storageBucket: "memo-shade.appspot.com",
  messagingSenderId: "970376470206",
  appId: "1:970376470206:web:b91f57037cebc7e83bc8ef",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function saveCoachDataToFirebase(coachData, emuType, currentDate) {
  const promises = coachData.map((coach) => {
    const coachRef = ref(
      database,
      `train-monitoring/${currentDate}/${emuType}/${coach.coach}`
    );
    return set(coachRef, coach);
  });

  return Promise.all(promises);
}
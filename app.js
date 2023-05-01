// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7TaUJRqkz1CfLHR_9o0RnkVcAzRoJzJI",
    authDomain: "yoyo-bec72.firebaseapp.com",
    projectId: "yoyo-bec72",
    storageBucket: "yoyo-bec72.appspot.com",
    messagingSenderId: "444974067404",
    appId: "1:444974067404:web:3f7386f7a4c2a455cd1c69",
    measurementId: "G-5MYSY63QKH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();
const musicListRef = database.ref('musicList');
const musicFilesRef = storage.ref('musicFiles');

document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const musicFile = document.getElementById('musicFile').files[0];
    uploadMusic(musicFile);
});

function uploadMusic(musicFile) {
    const uploadTask = musicFilesRef.child(musicFile.name).put(musicFile);

    uploadTask.on('state_changed', (snapshot) => {
        // Handle progress
    }, (error) => {
        console.error('Upload error:', error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const newMusicRef = musicListRef.push();
            newMusicRef.set({
                name: musicFile.name,
                url: downloadURL
            });
        });
    });
}

function createMusicListItem(music) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = music.name;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-sm btn-outline-primary';
    toggleButton.textContent = 'Select';
    toggleButton.onclick = () => {
        database.ref('selectedMusic').set(music.key);
    };

    listItem.appendChild(toggleButton);
    return listItem;
}

musicListRef.on('child_added', (snapshot) => {
    const music = snapshot.val();
    music.key = snapshot.key;
    const listItem = createMusicListItem(music);
    document.querySelector('#uploadedMusicList ul').appendChild(listItem);
});
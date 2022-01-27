import React from 'react'
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage"
import * as ImagePicker from 'expo-image-picker';

async function pickImage() {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        return alert("Permission to access to camera photos denied!");
    }
    // No permissions request is necessary for launching the image library       
    let cameraPhotosResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
    });
    if (!cameraPhotosResult.cancelled) {
        return cameraPhotosResult.uri;
    }
};

async function takePhotoWithCamera() {
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted === false) {
        alert('Permission to access to camera denied')
    }
    let cameraResult = await ImagePicker.launchCameraAsync()
    if (!cameraResult.cancelled) {
        return cameraResult.uri
    }
}
async function uploadPhotoToStorage(uri, email) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            // something went wrong
            reject(new Error('Network request failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    let imageUrl = uri.split("/ImagePicker/")
    const refR = ref(getStorage(), 'users/' + email + '/sentPhotos/' + imageUrl[1])
    const result = await uploadBytes(refR, blob)
    blob.close();
    return getDownloadURL(refR)
}
export { uploadPhotoToStorage, pickImage, takePhotoWithCamera }

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
async function uploadPhotoToStorage(folderName, uri, emailOrId, subFolder) {
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
    /*Regular Expression for getting everything after last slash */
    let imageUrl = uri.split(/([^\/]+$)/g)
    const metadata = {
        contentType: 'image/jpeg',
    };
    const refR = ref(getStorage(), `${folderName}/` + emailOrId + `/${subFolder}/` + imageUrl[1])
    const result = await uploadBytes(refR, blob, metadata)
    blob.close();
    return getDownloadURL(refR)
}

export { uploadPhotoToStorage, pickImage, takePhotoWithCamera }

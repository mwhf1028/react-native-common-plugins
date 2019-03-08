import React, {Component} from 'react';
import RNFetchBlob from 'rn-fetch-blob'
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    Image,
    TouchableOpacity
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';


export default class ChooseImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    downloadFile(){
        RNFetchBlob
            .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                fileCache : true,
            })
            .fetch('GET', 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=1fdff22000f79052ef4a4f383cc3fbf2/78310a55b319ebc4883ef7aa8b26cffc1e1716ba.jpg', {
                //some headers ..
            })
            .then((res) => {
                // the temp file path
                path = res.path();
                console.log('res',res)
                console.log('The file saved to ', res.path())
            })
    }

    uploadFile(){
        RNFetchBlob.fetch('POST', 'url', {
            // dropbox upload headers
            Authorization : "Bearer access-token...",
            'Dropbox-API-Arg': JSON.stringify({
                path : '/img-from-react-native.png',
                mode : 'add',
                autorename : true,
                mute : false
            }),
            'Content-Type' : 'application/octet-stream',
            // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
            // Or simply wrap the file path with RNFetchBlob.wrap().
        }, RNFetchBlob.wrap(path))
            .then((res) => {
                console.log(res.text())
            })
            .catch((err) => {
                // error handling ..
                console.log('err:',err)
            })
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress = {this.downloadFile.bind(this)}>
                    <Text>download</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {this.uploadFile.bind(this)}>
                    <Text>upload</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

//https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=1fdff22000f79052ef4a4f383cc3fbf2/78310a55b319ebc4883ef7aa8b26cffc1e1716ba.jpg

const styles = StyleSheet.create({

});
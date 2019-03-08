//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View ,Button,PermissionsAndroid} from 'react-native';
import Upload from 'react-native-background-upload'



export default class BackgroundUpload extends Component {
    constructor(props) {
        super(props);
        // requestCameraPermission();
    }

    render() {
        return (
            <View>
                <Text>Hello world!</Text>
                <Button title='upload something in background' color='red' onPress={this.upload}/>
            </View>
        );
    }

    upload(){
        const options = {
            url: 'http://192.168.1.107:8011/upload',
            // path: 'file://path/to/file/on/device',
            path: '/storage/emulated/0/DCIM/100MEDIA/VIDEO0197.mp4',
            method: 'POST',
            type: 'raw',
            headers: {
                'content-type': 'application/octet-stream', // Customize content-type
                'my-custom-header': 's3headervalueorwhateveryouneed'
            },
            // Below are options only supported on Android
            notification: {
                enabled: true
            }
        }
        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started')
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log(`Error: ${data.error}%`)
                console.log(data);
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                // data includes responseCode: number and responseBody: Object
                console.log('Completed!')
            })
        }).catch((err) => {
            console.log('Upload error!', err)
        })
    }

}
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import TakePhoto from './src/takePhoto'
import TakeVideo from './src/takeVideo'
import ScanQrCode from './src/scanQrCode'
import ChoosePhoto from './src/chooseImage'
import File from './src/file'
import RecordAudio from './src/recordAudio'
import BackgroundUpload from './src/backgroundUpload'
import Zip from './src/zip'
import WebRTC from './src/webRTC'
import Share from './src/share'
import NativeFunction from './src/reactNativeFunction'



type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {/*<TakePhoto />*/}
        {/*<TakeVideo/>*/}
        {/*<ScanQrCode />*/}
        {/*<ChoosePhoto />*/}
        {/*<File />*/}
        {/*<RecordAudio />*/}
        {/*<BackgroundUpload/>*/}
        {/*<Zip />*/}
        <NativeFunction />
        {/*<Text>haven't done yet</Text>*/}
        {/*<Share />*/}
        {/*<WebRTC/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

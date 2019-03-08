/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    Dimensions,
    ScrollView,
    Button, TouchableOpacity, Platform,FlatList
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';

var Sound = require('react-native-sound');


var Props = {};
export default  class RecordAudio extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            isRefreshing: false,
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            hasPermission: undefined,

        }
    }
    //录音相关
    record_prepareRecordingPath(audioPath){

        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentWillMount(): void {
        this.record_init();
    }

    record_init(){
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            if (!isAuthorised) return;

            this.record_prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this.record_finish(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }


    async record_pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }

    async record_resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }

    async record_stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this.record_finish(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }


    async record_start() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if(this.state.stoppedRecording){
            this.record_prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            //  const filePath = await
            AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    record_finish(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);

        this.record_play();
    }



    async record_play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    startRecordAudio(){
        this.record_start();
        console.log('start recording');
    }
    endRecordAudio(){
        this.record_stop()
    }

    render() {
        return(
            <TouchableOpacity   onPressIn={this.startRecordAudio.bind(this)} onPressOut={this.endRecordAudio.bind(this)}>
                <Text style = {{fontSize:30}}>Hold this text to starting record,release to stop it</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

});


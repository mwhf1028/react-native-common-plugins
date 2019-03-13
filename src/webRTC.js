import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';



/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

type Props = {};
export default class App extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(): void {
        const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        const pc = new RTCPeerConnection(configuration);

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
                .then(stream => {
                    console.log('stream:',stream)
                    this.setState({
                        stream
                    })
                    // Got stream!
                })
                .catch(error => {
                    console.log(error)
                    // Log error
                });
        });

        pc.createOffer().then(desc => {
            pc.setLocalDescription(desc).then(() => {
                // Send pc.localDescription to peer
            });
        });

        pc.onicecandidate = function (event) {
            // send event.candidate to peer
        };
    }

    render() {
        return (
           <View>
               {
                   // this.state.stream?<RTCView style = {{width:300,height:300}} streamURL={this.state.stream.toURL()}/>:null
               }
           </View>
        );
    }
}

const styles = StyleSheet.create({

});

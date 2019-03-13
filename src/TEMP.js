/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,TouchableHighlight,TextInput,ListView} from 'react-native';
import io from 'socket.io-client';
import mediaDevices from "react-native-webrtc/MediaDevices";

const socket = io.connect('https://react-native-webrtc.herokuapp.com', {transports: ['websocket']});
var WebRTC = require('react-native-webrtc');
var {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia,
} = WebRTC;



// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });


type Props = {};
var container;
export default class webRTC extends Component<Props> {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        this.state = { videoURL: null ,
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: true,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: ''
        };
    }
    // getInitialState(){
    //     return {videoURL: null};
    // }




    componentDidMount(){
        container = this;
    }
    _press(event) {
        container.refs.roomID.blur();
        container.setState({status: 'connect', info: 'Connecting'});
        join(container.state.roomID);
    }
    _switchVideoType() {
        const isFront = !container.state.isFront;
        container.setState({isFront});
        getLocalStream(isFront, function(stream) {
            if (localStream) {
                for (const id in pcPeers) {
                    const pc = pcPeers[id];
                    pc && pc.removeStream(localStream);
                }
                localStream.release();
            }
            localStream = stream;
            container.setState({selfViewSrc: stream.toURL()});

            for (const id in pcPeers) {
                const pc = pcPeers[id];
                pc && pc.addStream(localStream);
            }
        });
    }

    receiveTextData(data) {
        const textRoomData = container.state.textRoomData.slice();
        textRoomData.push(data);
        container.setState({textRoomData, textRoomValue: ''});
    }

    _textRoomPress() {
        if (!container.state.textRoomValue) {
            return
        }
        const textRoomData = container.state.textRoomData.slice();
        textRoomData.push({user: 'Me', message: container.state.textRoomValue});
        for (const key in pcPeers) {
            const pc = pcPeers[key];
            pc.textDataChannel.send(container.state.textRoomValue);
        }
        container.setState({textRoomData, textRoomValue: ''});
    }

    _renderTextRoom() {
        return (
            <View style={styles.listViewContainer}>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
                    renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
                />
                <TextInput
                    style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={value => this.setState({textRoomValue: value})}
                    value={this.state.textRoomValue}
                />
                <TouchableHighlight
                    onPress={this._textRoomPress}>
                    <Text>Send</Text>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {this.state.info}
                </Text>
                {this.state.textRoomConnected && this._renderTextRoom()}
                <View style={{flexDirection: 'row'}}>
                    <Text>
                        {this.state.isFront ? "Use front camera" : "Use back camera"}
                    </Text>
                    <TouchableHighlight
                        style={{borderWidth: 1, borderColor: 'black'}}
                        onPress={this._switchVideoType}>
                        <Text>Switch camera</Text>
                    </TouchableHighlight>
                </View>
                { this.state.status == 'ready' ?
                    (<View>
                        <TextInput
                            ref='roomID'
                            autoCorrect={false}
                            style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setState({roomID: text})}
                            value={this.state.roomID}
                        />
                        <TouchableHighlight
                            onPress={this._press}>
                            <Text>Enter room</Text>
                        </TouchableHighlight>
                    </View>) : null
                }
                <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>
                {
                    mapHash(this.state.remoteList, function(remote, index) {
                        console.log('瑞motelist',container.state.remoteList)
                        console.log('瑞',remote)
                        console.log('自己',container.state.selfViewSrc)
                        return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
                    })
                }
            </View>
        );
    }

}
var pcPeers = {};
var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
var pc = new RTCPeerConnection(configuration);
function getLocalStream(isFront, callback){


    // isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
        // console.log(sourceInfos);
        // let videoSourceId;
        // for (let i = 0; i < sourceInfos.length; i++) {
        //     const sourceInfo = sourceInfos[i];
        //     if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
        //         videoSourceId = sourceInfo.id;
        //     }
        // }
        if(container.state.isFront == true){
            var videoSourceId = sourceInfos[1].id;
        }
        else{
            var videoSourceId = sourceInfos[0].id;
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
                callback(stream);
                // Got stream!
            })
            .catch(error => {
                console.log(error)
                // Log error
            });
    });

    pc.createOffer(function(desc) {
        pc.setLocalDescription(desc, function () {
            // Send pc.localDescription to peer
        }, function(e) {});
    }, function(e) {});

    pc.onicecandidate = function (event) {
        // send event.candidate to peer
    };
}



const styles = StyleSheet.create({
    selfView: {
        width: 200,
        height: 150,
        position:'absolute',
        top:0,
        right:0
    },
    remoteView: {
        width: 200,
        height: 150,
        position:'absolute',
        bottom:0,
        left:0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    listViewContainer: {
        height: 150,
    },
});

var localStream;
function join(roomID) {
    socket.emit('join', roomID, function(socketIds){
        console.log('join', socketIds);
        for (const i in socketIds) {
            const socketId = socketIds[i];
            createPC(socketId, true);
        }
    });
}

function createPC(socketId, isOffer) {
    const pc = new RTCPeerConnection(configuration);
    pcPeers[socketId] = pc;

    pc.onicecandidate = function (event) {
        console.log('onicecandidate', event.candidate);
        if (event.candidate) {
            socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
        }
    };

    function createOffer() {
        pc.createOffer(function(desc) {
            console.log('createOffer', desc);
            pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', pc.localDescription);
                socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
            }, logError);
        }, logError);
    }

    pc.onnegotiationneeded = function () {
        console.log('onnegotiationneeded');
        if (isOffer) {
            createOffer();
        }
    }

    pc.oniceconnectionstatechange = function(event) {
        console.log('oniceconnectionstatechange', event.target.iceConnectionState);
        if (event.target.iceConnectionState === 'completed') {
            setTimeout(() => {
                getStats();
            }, 1000);
        }
        if (event.target.iceConnectionState === 'connected') {
            createDataChannel();
        }
    };
    pc.onsignalingstatechange = function(event) {
        console.log('onsignalingstatechange', event.target.signalingState);
    };

    pc.onaddstream = function (event) {
        container.setState({info: 'One peer join!'});

        const remoteList = container.state.remoteList;
        remoteList[socketId] = event.stream.toURL();
        console.log('addStream:',event.stream.toURL());
        container.setState({ remoteList: remoteList });
    };
    pc.onremovestream = function (event) {
        console.log('onremovestream', event.stream);
    };

    pc.addStream(localStream);
    function createDataChannel() {
        if (pc.textDataChannel) {
            return;
        }
        const dataChannel = pc.createDataChannel("text");

        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };

        dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
            container.receiveTextData({user: socketId, message: event.data});
        };

        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
            container.setState({textRoomConnected: true});
        };

        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };

        pc.textDataChannel = dataChannel;
    }
    return pc;
}

function exchange(data) {
    const fromId = data.from;
    let pc;
    console.log(fromId,pcPeers);
    if (fromId in pcPeers) {
        pc = pcPeers[fromId];
    } else {
        pc = createPC(fromId, false);
    }

    if (data.sdp) {
        console.log('exchange sdp', data);
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            if (pc.remoteDescription.type == "offer")
                pc.createAnswer(function(desc) {
                    console.log('createAnswer', desc);
                    pc.setLocalDescription(desc, function () {
                        console.log('setLocalDescription', pc.localDescription);
                        socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
                    }, logError);
                }, logError);
        }, logError);
    } else {
        console.log('exchange candidate', data);
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}

function leave(socketId) {
    console.log('leave', socketId);
    const pc = pcPeers[socketId];
    const viewIndex = pc.viewIndex;
    pc.close();
    delete pcPeers[socketId];

    const remoteList = container.state.remoteList;
    delete remoteList[socketId]
    container.setState({ remoteList: remoteList });
    container.setState({info: 'One peer leave!'});
}

socket.on('exchange', function(data){
    exchange(data);
});
socket.on('leave', function(socketId){
    leave(socketId);
});

socket.on('connect', function(data) {
    console.log('connected');
    getLocalStream(true, function(stream) {
        localStream = stream;
        container.setState({selfViewSrc: stream.toURL()});
        container.setState({status: 'ready', info: 'Please enter or create room ID'});
    });
});

function logError(error) {
    console.log("logError", error);
}

function mapHash(hash, func) {
    const array = [];
    for (const key in hash) {
        const obj = hash[key];
        array.push(func(obj, key));
    }
    return array;
}

function getStats() {
    const pc = pcPeers[Object.keys(pcPeers)[0]];
    if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
        const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
        console.log('track', track);
        pc.getStats(track, function(report) {
            console.log('getStats report', report);
        }, logError);
    }
}

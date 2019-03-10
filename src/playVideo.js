import React, { Component } from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
import Video from 'react-native-video';




export default class PlayVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uri:require('../assets/smallVideo.mp4')
        }
    }


    render() {
        return (
            <View>
                <Text>play the video</Text>
                <Video source={this.state.uri}   // Can be a URL or a local file.
                       ref={(ref) => {
                           this.player = ref
                       }}                                      // Store reference
                       onBuffer={()=>{console.log('success')}}                // Callback when remote video is buffering
                       onError={()=>{console.log('failed')}}               // Callback when video cannot be loaded
                       style={{width:200,height:400}} />
            </View>
        );
    }


}
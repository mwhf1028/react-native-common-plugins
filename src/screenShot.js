//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View,TouchableOpacity,Image} from 'react-native';
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
let ClipStr;

export default class CaptureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    captureScreen(){
        captureScreen({
            format: "jpg",
            quality: 0.8
        })
            .then(
                uri => {
                    console.log("Image saved to", uri);
                    this.setState({
                        url:uri
                    })
                },
                error => console.error("Oops, snapshot failed", error)
            );
    }


    render() {
        return (
            <TouchableOpacity onPress = {this.captureScreen.bind(this)}>
                <Text style = {{color:'red',fontSize:50}}>capture screen</Text>
                {
                    this.state.url?<Image source = {{uri:this.state.url}} style = {{width:200,height:200}}></Image>:null
                }
            </TouchableOpacity>
        );
    }


}
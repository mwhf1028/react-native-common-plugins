import React, { Component } from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
import Share, {ShareSheet, Button} from 'react-native-share';

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

export default class Sh extends Component {
    constructor(props) {
        super(props);
    }

    openShare(){
        Share.open(shareOptions);
    }

    render() {

        return (
            <TouchableOpacity onPress = {this.openShare}>
               <Text>share</Text>
            </TouchableOpacity>
        );
    }


}
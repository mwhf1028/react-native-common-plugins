//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
let ClipStr;

export default class WebRTC extends Component {
    constructor(props) {
        super(props);
    }
    async _getContent() {
        ClipStr = await Clipboard.getString();
        console.log('ddd');
        console.log(ClipStr);
    }

    componentDidMount(): void {
        this._getContent();
    }


    render() {
        return (
            <View>
                <Text>RTC</Text>
            </View>
        );
    }


}
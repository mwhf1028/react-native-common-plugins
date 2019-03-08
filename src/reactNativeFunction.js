//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View,TouchableOpacity,Clipboard } from 'react-native';

export default class WebRTC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            str:'nothing'
        }
    }
    async _getContent() {
        let str = await Clipboard.getString();
        this.setState({
            str:str
        })
    }

    componentDidMount(): void {
        this._getContent();
    }


    render() {
        return (
            <View>
                <Text>if you copy something you will see it</Text>
                <Text>{this.state.str}</Text>
            </View>
        );
    }


}
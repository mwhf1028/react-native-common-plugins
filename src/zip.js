//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
import { zip, unzip, unzipAssets, subscribe} from 'react-native-zip-archive'


let DocumentDirectoryPath = ''
const targetPath = `${DocumentDirectoryPath}/myFile.zip`
const sourcePath = DocumentDirectoryPath

export default class Zip extends Component {
    constructor(props) {
        super(props);
    }
    zipFile(){
        zip(sourcePath, targetPath)
            .then((path) => {
                console.log(`zip completed at ${path}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    unzipFile(){
        unzip(sourcePath, targetPath)
            .then((path) => {
                console.log(`unzip completed at ${path}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress = {this.zipFile.bind(this)}>
                    <Text>Zip</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {this.unzipFile.bind(this)}>
                    <Text>Unzip</Text>
                </TouchableOpacity>
            </View>
        );
    }


}
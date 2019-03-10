//https://www.npmjs.com/package/react-native-background-upload
//background-file-upload
import React, { Component } from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
var RNFS = require('react-native-fs');

export default class FileSystem extends Component {
    constructor(props) {
        super(props);
    }

    createFile(){
        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var path = RNFS.DocumentDirectoryPath + '/test.txt';

        // write the file
        RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    readFile(){
        // get a list of files and directories in the main bundle
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);

                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(statResult[1], 'utf8');
                }

                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }




    render() {
        return (
            <View>
                <TouchableOpacity onPress = {this.createFile.bind(this)}>
                    <Text>Create File</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {this.readFile.bind(this)} style = {{marginTop:50}}>
                    <Text>Read File</Text>
                </TouchableOpacity>
            </View>
        );
    }


}
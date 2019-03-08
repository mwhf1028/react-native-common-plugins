import ImagePicker from 'react-native-image-picker';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    Image,
    TouchableOpacity
} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';

export default class ChooseImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    uploadImage(){
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    imageUrl:source
                },()=>{console.log('imageUrl:',this.state.imageUrl)});
            }
        });
    }

    render() {
        return (
           <View>
               <TouchableOpacity onPress = {this.uploadImage.bind(this)}>
                   <Text>Choose</Text>
               </TouchableOpacity>
               {
                   this.state.imageUrl? <Image source = {this.state.imageUrl} style = {styles.image}></Image>:null
               }

           </View>
        );
    }
}

/*
//To Launch the Camera or Image Library directly (skipping the alert dialog) you can do the following

// Launch Camera:
ImagePicker.launchCamera(options, (response) => {
    // Same code as in above section!
});

// Open Image Library:
ImagePicker.launchImageLibrary(options, (response) => {
    // Same code as in above section!
});

 */

const styles = StyleSheet.create({
    image:{
        width:50,
        height:50
    }
});
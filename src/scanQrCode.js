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

export default class ScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: -200,
                duration: 1500,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    };
    //  识别二维码
    onBarCodeRead = (result) => {
        console.log(result);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style = {styles.topBar}>
                    <Text style = {styles.topBarText}>扫描二维码</Text>
                </View>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                        {/*<Animated.View style={[*/}
                        {/*styles.border,*/}
                        {/*{transform: [{translateY: this.state.moveAnim}]}]}/>*/}
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                </RNCamera>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    topBarIcon:{
        width:20,
        height:20,
        position: 'absolute',
        left:20,
        top:10
    },
    topBarIconImage:{
        width:20,
        height:20
    },
    topBarText:{
        color:'white',
        fontSize:16
    },
    topBar:{
        width:'100%',
        height:45,
        position:'absolute',
        top:0,
        zIndex:999,
        flexDirection:'row',
        justifyContent:'center',
        paddingTop:10
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
});
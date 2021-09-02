import React from 'react';
import LottieView from "lottie-react-native";
import {View} from "react-native";

function AppLottieViewAnim({lottieAutoPlay, lottieSource, lottieStyle, lottieLoop}) {
    return (
        <View style={{
            position: 'absolute',
            top: 10,
            right: 20
        }}>
            <LottieView style={lottieStyle} autoPlay={lottieAutoPlay} loop={lottieLoop} source={lottieSource}/>
        </View>
    );
}

export default AppLottieViewAnim;
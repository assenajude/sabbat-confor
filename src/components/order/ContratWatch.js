import React from 'react';
import {View} from "react-native";
import LottieView from "lottie-react-native";

function ContratWatch({autoPlay,loop}) {
    return (
        <View style={{
            justifyContent: 'flex-start',
            paddingTop:0,
            marginTop: 0

        }}>
            <LottieView style={{ width: 150}} autoPlay={autoPlay} loop={loop} source={require('../../assets/animations/data_watch')}/>
        </View>
    );
}

export default ContratWatch;
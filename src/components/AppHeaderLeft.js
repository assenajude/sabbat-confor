import React from 'react';
import {TouchableWithoutFeedback} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from "../utilities/colors";

function AppHeaderLeft({onPress}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <MaterialCommunityIcons style={{marginHorizontal: 10}} name='arrow-left' color={colors.blanc} size={30}/>
        </TouchableWithoutFeedback>
    );
}

export default AppHeaderLeft;
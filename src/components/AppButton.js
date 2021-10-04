import React from 'react';
import {Button} from "react-native-paper";

function AppButton({iconName,onPress,title,style,mode='contained',height=50,labelStyle, ...props }) {
    return (
        <Button
            contentStyle={{height: height}}
            icon={iconName}
            mode={mode}
            onPress={onPress}
            style={[style]}
            labelStyle={labelStyle}
            {...props}
        >{title}</Button>
    );
}

export default AppButton;

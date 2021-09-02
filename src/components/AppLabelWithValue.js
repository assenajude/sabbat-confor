import React from 'react';
import {View} from "react-native";
import AppText from "./AppText";

function AppLabelWithValue({label, labelValue, secondLabel, secondLabelValue, labelStyle}) {
    return (
        <View style={{
            flexDirection: 'row'
        }}>
            <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
            <AppText lineNumber={2} style={[{width: "85%"}, labelStyle]}>{labelValue}</AppText>
            {secondLabel && <AppText>{secondLabel}</AppText>}
            {secondLabelValue && <AppText>{secondLabelValue}</AppText>}
        </View>
    );
}

export default AppLabelWithValue;
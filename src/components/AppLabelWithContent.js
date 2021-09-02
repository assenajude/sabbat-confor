import React from 'react';
import {View} from "react-native";
import AppText from "./AppText";
import ItemSeparator from "./list/ItemSeparator";

function AppLabelWithContent({label, content, showSeparator=true}) {
    return (
        <View style={{
            marginVertical: 10,
            marginHorizontal: 10
        }}>
            <View style={{
                alignItems: 'flex-start',
            }}>
                <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
            </View>
            <AppText style={[{alignSelf: 'center'}]}>{content}</AppText>
            {showSeparator && <ItemSeparator/>}
        </View>
    );
}

export default AppLabelWithContent;
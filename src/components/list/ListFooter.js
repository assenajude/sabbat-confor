import React from 'react';
import {IconButton} from "react-native-paper";
import colors from "../../utilities/colors";



function ListFooter({otherStyle, onPress}) {
    return (
        <IconButton
            style={[{backgroundColor: colors.bleuFbi}, otherStyle]}
            icon="plus"
            size={40}
            color={colors.blanc}
            onPress={onPress}
        />

    );
}

export default ListFooter;
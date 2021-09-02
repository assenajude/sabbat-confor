import React from 'react';
import {Button} from "react-native-paper";
import colors from "../../utilities/colors";

function AddToCartButton({onPress, label,style}) {
    return (
        <Button
            style={style}
            color={colors.rougeBordeau}
            mode='contained'
            onPress={onPress}
            icon='cart'>
            {label}
        </Button>
    );
}

export default AddToCartButton;
import React from 'react';
import colors from "../../utilities/colors";
import AppButton from "../AppButton";

function AddToCartButton({onPress, label,style}) {
    return (
        <AppButton
            height={40}
            style={[{width: 200, backgroundColor: colors.rougeBordeau}, style]}
            title={label}
            onPress={onPress}
            iconName='cart'
        />
    );
}

export default AddToCartButton;
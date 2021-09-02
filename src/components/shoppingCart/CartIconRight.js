import React from 'react';
import AppShoppingCart from "./AppShoppingCart";

function CartIconRight({getToCartScreen}) {
    return (
        <AppShoppingCart
            onPress={getToCartScreen}
        />
    );
}

export default CartIconRight;
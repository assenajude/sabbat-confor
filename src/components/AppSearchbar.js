import React from 'react';
import {Searchbar} from "react-native-paper";

function AppSearchbar({value,style, onChangeText}) {
    return (
        <Searchbar
            style={[{marginHorizontal: 20}, style]}
            onChangeText={onChangeText}
            value={value}
            placeholder='chercher ici...'
        />
    );
}

export default AppSearchbar;
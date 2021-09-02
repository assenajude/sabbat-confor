import React from 'react';
import {Asset} from 'expo-asset'
import PDFReader from "rn-pdf-reader-js";

function CguScreen(props) {
    const url = Asset.fromModule(require('../assets/cgu.pdf')).uri
    return (
        <PDFReader withPinchZoom={true} source={{uri: url}}/>
        );

}

export default CguScreen;
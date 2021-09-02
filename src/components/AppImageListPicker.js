import React, {useRef} from 'react';
import {View, ScrollView} from "react-native";
import AppInputImage from "./AppInputImage";

function AppImageListPicker({imagesData= [], deleteImage, addNewImage}) {
    const scrollView = useRef()
    
    return (
        <View>
            <ScrollView  ref={scrollView} horizontal onContentSizeChange={() => scrollView.current.scrollToEnd()}>
                   <View style={{flexDirection: 'row',justifyContent: "center", alignItems: "center"}}>
                    {imagesData.map((image, index) => <View key={index.toString()} style={{margin: 10}}>
                        <AppInputImage imageUrl={image.url || image} changeImage={() => deleteImage(image)}
                        />
                        </View>
                        )}
                          <AppInputImage changeImage={(image) => addNewImage(image)}/>
                   </View>
            </ScrollView>
        </View>
    );
}

export default AppImageListPicker;
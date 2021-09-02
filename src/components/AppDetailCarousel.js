import React from 'react';
import AppText from "./AppText";
import colors from "../utilities/colors";
import {Image, ScrollView, View} from "react-native";

function AppDetailCarousel({detailLabel, labelValue, carouselItems, typeFacture}) {
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <AppText style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>{detailLabel}</AppText>
                <AppText style={{fontWeight: 'bold', color: colors.or, fontSize: 20}}>{labelValue}</AppText>
            </View>
            {carouselItems.length === 1 && <View style={{margin: 10}}>
                <Image style={{width: '100%', height: 300}} source={{uri: carouselItems[0].OrderItem.image}}/>
            </View>}
            {carouselItems.length>1 && <ScrollView horizontal>
                {carouselItems.map((item, index) => <View  key={index} style={{margin: 10}} >
                    <Image source={{uri: item.OrderItem.image}} style={{width: 200, height: 200}}/>
                </View>)}
            </ScrollView>}
            <View>
                <AppText style={{fontWeight: 'bold'}}>{carouselItems.length >1?'Achats divers':`${typeFacture} ` +carouselItems[0].OrderItem.libelle}</AppText>
            </View>
        </View>
    );
}

export default AppDetailCarousel;
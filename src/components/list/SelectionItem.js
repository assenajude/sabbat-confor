import React, {useState} from 'react';
import {TouchableOpacity, View, Image, StyleSheet} from 'react-native'
import AppText from "../AppText";
import colors from "../../utilities/colors";
import LottieView from 'lottie-react-native'

function SelectionItem({imageUrl, label, selectItem,header}) {

    const [imageLoading, setImageLoading] = useState(true)
    return (
        <TouchableOpacity style={styles.container} onPress={selectItem}>
            <View >
                <View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {imageUrl && <Image
                            onLoadEnd={() => setImageLoading(false)}
                            resizeMode='contain' source={imageUrl} style={styles.imageStyle}/>}
                            {header && <AppText style={styles.header}>{header}</AppText>}
                    </View>
                {imageLoading && <View style={styles.imageLoading}>
                    <LottieView
                        loop={true}
                        autoPlay={true}
                        style={{
                            height: 60,
                            width: 60
                        }}
                        source={require('../../assets/animations/image-loading')}/>
                </View>}
                </View>
                <View style={{
                    alignSelf: 'center'
                }}>
                    <AppText style={{color: colors.bleuFbi, fontSize: 15}}>{`(${label})`}</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 10,
        maxWidth: 150,
        maxHeight: 150,
        minHeight: 100,
        minWidth: 100,
        backgroundColor: colors.lightGrey,
        borderRadius: 10
    },
    imageStyle: {
        height: 80,
        width: 80,
        overflow: 'hidden',
        borderRadius: 40
    },
    imageLoading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        backgroundColor: colors.leger
    },
    header: {
        fontWeight: 'bold',
        color: colors.bleuFbi,
        backgroundColor: colors.blanc,
        top: -30
    }
})
export default SelectionItem;
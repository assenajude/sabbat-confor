import React from 'react';
import {FlatList, Modal, StyleSheet,TouchableOpacity, Text, TextInput, TouchableHighlight, View} from 'react-native'
import {EvilIcons, MaterialCommunityIcons, Entypo} from "@expo/vector-icons";
import PickerItem from "./picker/PickerItem";
import Color from "../utilities/colors";
function AppMainTopBar({style, getInput, leaveInput, onPress, showModal, closeModal,children, items, onSelect}) {
    return (
         <View style={styles.container}>
            <TouchableOpacity>
                <View style={[styles.searchContainer, style]}>
                    <TextInput style={styles.inputStyle} onFocus={getInput} onBlur={leaveInput} placeholder='chercher ici...'/>
                    <EvilIcons name='search' size={24} style={styles.searchIconStyle}/>
                </View>
            </TouchableOpacity>

            <TouchableHighlight style={{marginLeft: 15}} underlayColor='' activeOpacity={0.5} onPress={onPress}>
                <View style={styles.mainContainer}>
                    <Text style={styles.contentStyle}>{children}</Text>
                    <MaterialCommunityIcons style={styles.iconStyle} name='menu-down' size={24}/>
                </View>
            </TouchableHighlight>
            <Modal visible={showModal} animationType='slide' statusBarTranslucent={false}>
                <View style={styles.modalStyle}>
                    <View style={styles.modalContent}>
                        <FlatList data={items}
                                  keyExtractor={item => item.value.toString()}
                                  renderItem={({item}) => <PickerItem label={item.label} getPickerItem={() => {
                                      onSelect(item)
                                  }}/>}/>
                        <TouchableOpacity onPress={closeModal}>
                            <Entypo name="circle-with-cross" size={40} style={styles.closeModal} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}



const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        paddingLeft: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor:Color.blanc
    },
    container: {
      flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchIconStyle:{
        color: Color.blanc
    },
    contentStyle: {
        color: Color.blanc,
        width:'auto',
        height: 25
    },
    modalContent:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 150,
        top: 50,
        left: 50,
        borderWidth: 1
    },
    modalStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchContainer:
        {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            color: Color.blanc

        },
    inputStyle:{
        width:'auto',
        paddingBottom: 5,
        paddingTop: 5,
        borderBottomWidth: 1,
        color:Color.blanc,
        borderColor: Color.blanc
    },
    iconStyle:{
        color:Color.blanc,
    },
    closeModal: {
        color: Color.rougeBordeau
    }
})

export default AppMainTopBar;
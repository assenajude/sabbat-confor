import React from 'react';
import {View, TextInput,TouchableOpacity, StyleSheet, Modal,FlatList} from 'react-native'
import {EvilIcons,AntDesign} from '@expo/vector-icons'
import Color from '../utilities/colors'
import AppText from "./AppText";
import SelectionItem from "./list/SelectionItem";
import AppIconButton from "./AppIconButton";
import useMainFeatures from "../hooks/useMainFeatures";


function AppTopBar({style, leaveInput, changeSearchValue, searchValue, handleSearch, searching,
                       startingSearch, espace, showSpaceModal, spaceModalVisible,handleSelection,
                       closeSpaceModal, categoryList, getSelectedCategory,getAllCategories,
                   toCategorie, toLocalisation}) {

    const {getLocalisationLocationsLength} = useMainFeatures()

    return (
        <>
           {!searching &&
           <View
               style={{
                   flexDirection: 'row',
                   justifyContent: 'center',
                   alignItems: 'center',
               }}>
            <TouchableOpacity onPress={startingSearch}>
                <View style={{borderBottomWidth: 1, borderColor: Color.blanc}}>
                    <EvilIcons name='search' size={24} color='white'/>
                </View>
            </TouchableOpacity>
               <View style={{marginLeft: 40}}>
                      {espace !== 'home' && <TouchableOpacity onPress={showSpaceModal}>
                      <View>
                           <AntDesign name="appstore-o" size={25} color="white" />
                       </View>
                      </TouchableOpacity>
                      }
                  {espace !== 'home' &&
                  <Modal visible={spaceModalVisible} animation='slide' transparent>
                       <View style={styles.modalContainer}>
                               <TouchableOpacity style={styles.allCategoriesStyle} onPress={getAllCategories}>
                                   <View style={{alignItems: 'center'}}>
                                   <AppText style={{color:Color.blanc}}>Tous</AppText>
                                   </View>
                               </TouchableOpacity>
                           {espace === 'location' &&
                           <View style={{
                               flexDirection: 'row',
                               alignItems: 'center',
                               marginTop: 20
                           }}>
                               <AppIconButton
                                   iconSize={40}
                                   onPress={handleSelection}
                                   iconName='chevron-left'/>
                           <View style={styles.filter}>
                               {toCategorie && <AppText>Catégorie</AppText>}
                               {toLocalisation && <AppText>Localisation</AppText>}

                           </View>
                               <AppIconButton
                                   iconSize={40}
                                   onPress={handleSelection}
                                   iconName='chevron-right'/>
                           </View>
                           }
                            <FlatList
                                numColumns={2}
                                data={categoryList}
                                keyExtractor={(item, index) => index}
                            renderItem={({item}) =>
                                <SelectionItem
                                    selectItem={() => getSelectedCategory(item)}
                                    header={item?.ville?.nom || item?.quartier}
                                    imageUrl={{uri: item.imageCateg}}
                                    label={item.libelleCateg || item.localisations?.length || getLocalisationLocationsLength(item.id)}
                                />}/>
                           <AppIconButton
                               iconColor={Color.rougeBordeau}
                               onPress={closeSpaceModal}
                               buttonContainer={styles.closeButton}
                               iconName='close'/>
                       </View>


                   </Modal>}
               </View>
            </View>}
            {searching &&
            <View style={[styles.searchContainer, style]}>
            <TextInput style={styles.inputStyle} onFocus={startingSearch}  onBlur={leaveInput} value={searchValue} onChangeText={changeSearchValue} placeholder='chercher ici...'
                       onSubmitEditing={handleSearch} />
                <TouchableOpacity onPress={handleSearch}>
                <EvilIcons name='search' size={24} color='black'/>
                </TouchableOpacity>
            </View>
            }
            </>
    );
}

const styles = StyleSheet.create({
    searchContainer:
        {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            color: Color.blanc,
            backgroundColor: Color.blanc,
            borderRadius: 20

        },
    inputStyle:{
        width: 200,
        paddingBottom: 5,
        paddingLeft: 5,
        color:Color.dark,
        borderColor: Color.blanc
    },
    modalStyle:{
        backgroundColor: Color.blanc,
        height: '55%',
        width: '100%',
        alignItems: 'flex-start',
        position: 'absolute',
        top: 180,
    },
    modalContainer:{
        marginTop: '15%',
        backgroundColor: Color.blanc,
        height: '100%',
        alignItems: 'center',
        paddingBottom: 60
    },
    allCategoriesStyle: {
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: Color.bleuFbi,
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: 50
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15
    },
    filter: {
        width: 130,
        borderWidth: 5,
        borderColor: Color.leger,
        marginHorizontal: 10,
        marginVertical: 5
    }
})

export default AppTopBar;
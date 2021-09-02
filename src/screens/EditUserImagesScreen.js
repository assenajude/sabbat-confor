import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert, ToastAndroid} from "react-native";
import ProfileImagePicker from "../components/user/ProfileImagePicker";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import AppButton from "../components/AppButton";
import useDirectUpload from "../hooks/useDirectUpload";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getAvatarChange, getUserPieceUpdate} from "../store/slices/authSlice";
import AppUploadProgress from "../components/AppUploadProgress";

function EditUserImagesScreen(props) {
    const store = useStore()
    const dispatch = useDispatch()

    const {dataTransformer, directUpload} = useDirectUpload()

    const user = useSelector(state => state.auth.user)
    const connectedUserInfo = useSelector(state => state.profile.connectedUser)
    const [avatarModal, setAvatarModal] = useState(false)
    const [selectedAvatar, setSelectedAvatar] = useState({})
    const [selectedRecto, setSelectedRecto] = useState({})
    const [rectoModal, setRectoModal] = useState(false)
    const [selectedVerso, setSelectedVerso] = useState({})
    const [versoModal, setVersoModal] = useState(false)
    const [uploadModal, setUploadModal] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)


    const deleteAvatar = () => {
        Alert.alert('Alert', "Voulez-vous supprimer votre photo de profile?",
            [{text: 'oui', onPress: async() => {
                setSelectedAvatar({})
                await dispatch(getAvatarChange({avatarUrl: ''}))
                    const error = store.getState().auth.error
                    if(error !== null) {
                        ToastAndroid.showWithGravity('Une erreur est apparue, veuillez reessayer plutard', ToastAndroid.LONG, ToastAndroid.TOP)
                        return;
                    } else {
                        ToastAndroid.showWithGravity('Votre photo de profile a été supprimée avec succès', ToastAndroid.LONG, ToastAndroid.TOP)
                        return;
                    }
                }},
                {text:'non', onPress: () => {return;}}])
    }

    const handleSaveAvatar = async () => {
        if(Object.keys(selectedAvatar).length === 0) {
            return alert("Veuiller choisir une image")
        }
        const transformedAvatar = dataTransformer([selectedAvatar])
        setUploadProgress(0)
        setUploadModal(true)
        const uplaodResult = await directUpload(transformedAvatar, [selectedAvatar],
            (progress) => setUploadProgress(progress))
        setUploadModal(false)
        if(uplaodResult) {
            const signedResult = store.getState().s3_upload.signedRequestArray
            const url = signedResult[0].url
            await dispatch (getAvatarChange({avatarUrl: url}))
            const error = store.getState().auth.error
            if(error !== null){
                alert('Impossible de changer votre avatar, une erreur est apparue, veuillez reessayer plutard')
            } else {
                alert('votre avatar a été mis à jour avec succès')
            }
        }

    }

    const deletePiece = () => {
        Alert.alert('Alert', "Voulez-vous supprimer votre piece d'identité?",
            [{text: 'oui', onPress: async() => {
                    setSelectedRecto({})
                    setSelectedVerso({})
                    await dispatch(getUserPieceUpdate({userId:user.id, piecesUrlArray: []}))
                    const error = store.getState().auth.error
                    if(error !== null) {
                        ToastAndroid.showWithGravity('Une erreur est apparue, veuillez reessayer plutard', ToastAndroid.LONG, ToastAndroid.TOP)
                        return;
                    } else {
                        ToastAndroid.showWithGravity('Votre pièce a été supprimée avec succès', ToastAndroid.LONG, ToastAndroid.TOP)
                        return;
                    }
                }},
                {text:'non', onPress: () => {return;}}])
    }

    const deleteRecto = () => {
            Alert.alert("Alert", "Que voulez-vous faire de cette image?",
                [{text: 'changer', onPress: () => {setRectoModal(true)}},
                    {text: 'supprimer', onPress: () => {setSelectedRecto({})}}])
    }
    const deleteVerso = () => {
        Alert.alert("Alert", "Que voulez-vous faire de cette image?",
            [{text: 'changer', onPress: () => {setVersoModal(true)}},
                {text: 'supprimer', onPress: () => {setSelectedVerso({})}}])
    }

    const handleSavePiece = async () => {
        if(Object.keys(selectedRecto).length === 0 || Object.keys(selectedVerso).length === 0) {
            return alert("Veuillez choisir les 2 cotés de votre pièces avant de sauvegarder.")
        }
        let dataArray = []
        dataArray.push(selectedRecto, selectedVerso)
        const transformedArray = dataTransformer(dataArray)
        setUploadProgress(0)
        setUploadModal(true)
        const uploadPieceSuccess = await directUpload(transformedArray, dataArray, (progress) => setUploadProgress(progress))
        setUploadModal(false)
        if(uploadPieceSuccess) {
            const signedData = store.getState().s3_upload.signedRequestArray
            const piecesUrls = signedData.map(item => item.url)
            await dispatch(getUserPieceUpdate({userId:user.id, piecesUrlArray: piecesUrls}))
            const error = store.getState().auth.error
            if(error !== null) {
                alert('Impossible de mettre à jour votre pièce')
            } else {
                alert('Votre piece a été mise à jour avec succès')
            }
        }
    }
    return (
        <>
            <AppUploadProgress
                startProgress={uploadModal} progress={uploadProgress}
                dismissUploadModal={() => setUploadModal(false)}/>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.avatarContainer}>
                    <View style={styles.profileText}>
                        <AppText style={{color: colors.blanc}}>Image de profile</AppText>
                    </View>
                    <ProfileImagePicker
                        imageLabel='aucune image de profile'
                        imageModalVisible={avatarModal} imageUrl={{uri:selectedAvatar.url?selectedAvatar.url:user.avatar}}
                        showImageModal={() => setAvatarModal(true)}
                        dismissImageModal={() => setAvatarModal(false)}
                        deleteImage={deleteAvatar} onChangePhoto={(avatar)=>{
                            setSelectedAvatar(avatar)
                        setAvatarModal(false)
                    }}
                        onChangeImage={(avatar) => {
                            setSelectedAvatar(avatar)
                            setAvatarModal(false)
                        }}
                        deleteExistImage={deleteAvatar}
                        otherImageStyle={{borderRadius: 40}}/>
                         <AppButton
                             height={40}
                             width={130}
                             title='valider avatar'
                             style={{marginVertical: 20}}
                             onPress={handleSaveAvatar}/>
                </View>
                <View>
                </View>
                <View style={styles.pieceContainer}>
                    <View style={{backgroundColor: colors.rougeBordeau}}>
                        <AppText style={{color: colors.blanc}}>Piece identité</AppText>
                    </View>
                    <View  style={{flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                     <ProfileImagePicker
                         imageModalVisible={rectoModal}
                         showImageModal={() => setRectoModal(true)}
                         imageLabel='piece recto'
                         dismissImageModal={() =>setRectoModal(false)}
                         imageUrl={{uri: selectedRecto.url?selectedRecto.url: connectedUserInfo.pieceIdentite?connectedUserInfo.pieceIdentite[0]:undefined}}
                         onChangePhoto={(recto) => {
                             setSelectedRecto(recto)
                             setRectoModal(false)
                         } }
                         onChangeImage={(recto) => {
                             setSelectedRecto(recto)
                             setRectoModal(false)
                         }}
                         deleteImage={deletePiece}
                         deleteExistImage={deleteRecto}/>

                    <ProfileImagePicker
                        imageModalVisible={versoModal}
                        imageUrl={{uri: selectedVerso.url?selectedVerso.url:connectedUserInfo.pieceIdentite?connectedUserInfo.pieceIdentite[1]:undefined}}
                        onChangeImage={(verso) => {
                            setSelectedVerso(verso)
                            setVersoModal(false)
                        }} onChangePhoto={(verso) => {
                            setSelectedVerso(verso)
                        setVersoModal(false)
                    }}
                        showImageModal={() => setVersoModal(true)} dismissImageModal={() => setVersoModal(false)}
                        imageLabel='piece verso' deleteExistImage={deleteVerso} deleteImage={deletePiece}/>
                    </View>
                    <AppButton
                        height={40}
                        width={150}
                        title='Valider la pièce'
                        style={{
                            marginVertical: 20
                        }} onPress={handleSavePiece}/>
                </View>
            </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
        container: {
            paddingTop: 10,
            paddingBottom: 25
        },
    mainContainer: {
      justifyContent: 'center',
      alignItems: 'center',
        marginTop: 20
    },
    avatarStyle: {

    },
    profileText: {
        backgroundColor: colors.rougeBordeau
    },
    avatarContainer: {
        width: '50%',
        backgroundColor: colors.leger,
        borderRadius: 20,
        alignItems: 'center'
    },
    pieceContainer: {
        backgroundColor: colors.leger,
        alignItems: 'center',
        width: '90%',
        marginVertical: 40,
        borderRadius: 20
        }
})
export default EditUserImagesScreen;
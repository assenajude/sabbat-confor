import React, {useState} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {ScrollView,Alert} from 'react-native'

import * as Yup from 'yup'


import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {saveArticle} from '../store/slices/articleSlice'
import AppFormSwitch from "../components/forms/AppFormSwitch";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getHomeCounterIncrement} from "../store/slices/mainSlice";
import FormImageListPicker from "../components/forms/FormImageListPicker";
import useDirectUpload from "../hooks/useDirectUpload";
import AppUploadProgress from "../components/AppUploadProgress";
import AppFormTimePicker from "../components/forms/AppFormTimePicker";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";


const articleValidationSchema = Yup.object().shape({
    prixReel: Yup.number(),
    prixPromo: Yup.number(),
    quantite: Yup.number(),
    aide: Yup.boolean(),
    flashPromo: Yup.boolean(),
    debutPromo: Yup.date(),
    finPromo: Yup.date(),
    designation: Yup.string(),
    description: Yup.string(),
    images: Yup.array().min(1, 'Veuillez choisir au moins une image'),
    categorie: Yup.string()
})

function NewArticleScreen({route, navigation}) {
    const store = useStore()
    const {directUpload, dataTransformer} = useDirectUpload()
    const dispatch = useDispatch();
    const article = route.params
    const loading = useSelector(state => state.entities.article.loading)
    const categories = useSelector(state => {
        const list = state.entities.categorie.list
        const selectedList = list.filter(item => item.typeCateg === 'article')
        return selectedList
    });
    const [categorieId, setCategorieId] = useState(categories[0]?.id)
    const [upload, setUpload] = useState(false)
    const [progress, setProgress] = useState(0)

    const addArticle = async (newArticle, imagesUrl) => {
        const flashDebut = newArticle.debutPromo.getTime()
        const flashFin = newArticle.finPromo.getTime()

        const data = {
            categorieId,
            articleId: article?.id,
            designation: newArticle.designation,
            quantite: Number(newArticle.quantite),
            prixReel: Number(newArticle.prixReel),
            prixPromo: Number(newArticle.prixPromo),
            aide: newArticle.aide,
            flashPromo: newArticle.flashPromo,
            debutPromo: flashDebut,
            finPromo: flashFin,
            description: newArticle.description,
            articleImagesLinks: imagesUrl
        }

           await dispatch(saveArticle(data))
           const error = store.getState().entities.article.error
           if(error !== null) {
               alert("Erreur lors de lajout.")
           } else {
               dispatch(getHomeCounterIncrement())
               navigation.goBack()
           }
    }
    const handleAddArticle = async (newArticle) => {
        const images = newArticle.images
        const firstImage = images[0]
        let imagesUrl = article?article.imagesArticle : []
        if(firstImage.base64Data) {
            const array = dataTransformer(images)
            setProgress(0)
            setUpload(true)
            const uploadSucess =  await directUpload(array, images, (progress) => setProgress(progress))
            setUpload(false)
            if(uploadSucess) {
                let urlDataArray = store.getState().s3_upload.signedRequestArray
                imagesUrl = urlDataArray.map(item => item.url)
            }else {
                Alert.alert("Alert", "Les images n'ont pas été chargées voulez-vous continuer quand meme?",
                    [{text:'oui', onPress: async () => {
                            await addArticle(newArticle, imagesUrl)
                            return;
                        }},
                        {text: 'non', onPress: () => {return;}}])
            }
        }
        await addArticle(newArticle, imagesUrl)
    }

    const handleSelectedSpace = (value) => {
        const selectedCategorie = categories.find(item => item.libelleCateg.toLowerCase() === value.toLowerCase())
        setCategorieId(selectedCategorie.id)
    }

    return (
        <>
        <AppActivityIndicator visible={loading}/>
        <AppUploadProgress startProgress={upload} progress={progress}/>
        <ScrollView>
                    <AppForm initialValues={{
                        designation: article?article.designArticle : '',
                        quantite: article?String(article.qteStock) : '',
                        prixReel: article?String(article.prixReel) : '',
                        prixPromo: article?String(article.prixPromo) : '',
                        aide: article?article.aide : false,
                        description: article?article.descripArticle : '',
                        images: article?article.imagesArticle : [],
                        flashPromo: article?article.flashPromo : false,
                        debutPromo: article? new Date(article.debutPromo) : new Date(),
                        finPromo: article? new Date(article.finPromo) : new Date(),
                        categorie: article? article.Categorie.libelleCateg : categories[0]?.libelleCateg
                    }}
                             validationSchema={articleValidationSchema}
                             onSubmit={handleAddArticle}>
                        <AppFormItemPicker
                            handleSelectedValue={handleSelectedSpace}
                            name='categorie'
                            label='Categorie :'
                            items={categories.map(item => item.libelleCateg)}/>
                        <FormImageListPicker name='images' />
                        <AppFormField name='designation' title='designation'/>
                        <AppFormField name='quantite' title='Quantite'/>
                        <AppFormField name='prixReel' title='Prix réel'/>
                        <AppFormField name='prixPromo' title='Prix promo'/>
                        <AppFormField name='description' title='Description'/>
                        <AppFormSwitch name='aide' title='Possibilité de vente à credit?'/>
                        <AppFormSwitch name='flashPromo' title='cet article est en promo?'/>
                        <AppFormTimePicker label='Debut flash promo' name='debutPromo'/>
                        <AppFormTimePicker label='Fin flash promo' name='finPromo'/>
                        <AppSubmitButton
                            style={{
                                marginVertical: 40
                            }}
                            title='Ajouter'/>
                    </AppForm>
        </ScrollView>
      </>
    );

}

export default NewArticleScreen;
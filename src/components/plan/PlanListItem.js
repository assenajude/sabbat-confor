import React, {useState} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Image} from 'react-native'
import colors from "../../utilities/colors";
import AppText from "../AppText";
import LottieView from 'lottie-react-native'
import AppIconButton from "../AppIconButton";
import AppButton from "../AppButton";

function PlanListItem({planImage, imageStyle, imageDispo, label, description, getPlanDetail, editPlan, deletePlan}) {

    const [imageLoading, setImageLoading] = useState(true)

    return (
        <TouchableWithoutFeedback onPress={getPlanDetail}>
          <View style={styles.container}>
            {imageDispo && <View style={{width: '100%'}}>
                <View>
                   <Image onLoadEnd={() => setImageLoading(false)}
                       source={planImage}
                       style={[styles.planImageStyle, imageStyle]}/>
                   {imageLoading && <View style={styles.loadingContainer}>
                   <LottieView
                       style={{
                           width: 200,
                           height: 200,
                       }}
                       source={require('../../assets/animations/image-loading')}
                       loop={true}
                       autoPlay={true}/>

                   </View>}
                </View>
                    <AppText style={{color: colors.rougeBordeau, fontSize: 25, fontWeight:'bold'}}>{label}</AppText>
                    <AppText>{description}</AppText>
                </View>}
              {!imageDispo && <View>
                  <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
                    <AppText style={{color: colors.rougeBordeau, fontSize: 25, fontWeight: 'bold'}}>{label}</AppText>
                  </View>
                  <AppText>{description}</AppText>
              </View>}
              <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
              }}>
              <AppButton
                  title='+ Details' onPress={getPlanDetail}/>
                  <AppIconButton
                      onPress={editPlan}
                      iconName='circle-edit-outline' buttonContainer={{
                      backgroundColor: colors.bleuFbi,
                      marginHorizontal: 20
                  }}/>
                  <AppIconButton
                      iconName='delete-forever'
                      buttonContainer={{
                          backgroundColor: colors.rougeBordeau,
                          marginLeft: 10
                      }}
                      onPress={deletePlan}
                  />
              </View>
          </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.blanc,
        justifyContent: 'center',
        alignItems: "center",
        marginVertical: 20,
    },
    planImageStyle: {
        height: 300,
        width: '100%'
    },
    loadingContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: colors.leger,
        height: 250
    }
})

export default PlanListItem;
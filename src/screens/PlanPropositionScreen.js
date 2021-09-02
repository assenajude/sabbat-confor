import React from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback, ScrollView} from "react-native";
import AppText from "../components/AppText";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from "../utilities/colors";

function PlanPropositionScreen({navigation}) {
    return (
        <ScrollView>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AccueilNavigator',{screen:'PlanScreen'})}>
                <View style={{
                    backgroundColor: colors.blanc,
                    marginTop: 20
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        margin: 10,
                        marginLeft: 10,
                        paddingLeft: 5
                    }}>
                        <View>
                        <AntDesign name="infocirlce" size={15} color={colors.bleuFbi} />
                        </View>
                        <View style={{
                            paddingRight: 10
                        }}>
                        <AppText style={{color: colors.bleuFbi}}>Cherchez-vous un plan de payement qui puisse correspondre à vos préoccupations? Consultez ici.</AppText>
                        </View>
                    </View>
                    <View style={styles.planContainer}>
                        <Image source={require('../assets/plan_lion.jpg')} style={{height: 200, width: 200}}/>
                        <MaterialCommunityIcons name="hand-pointing-right" size={40} color="black" />
                        <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold', fontSize: 20}}>Plans</AppText>
                    </View>
                </View>

            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AccueilNavigator',{screen:'PropositionScreen'})}>
                <View style={{
                    backgroundColor: colors.blanc,
                    marginTop: 40
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        margin: 10,
                        marginLeft: 10,
                        paddingLeft: 5
                    }}>
                        <View>
                            <AntDesign name="infocirlce" size={15} color={colors.bleuFbi} />
                        </View>
                        <View style={{
                            paddingRight: 10
                        }}>
                            <AppText style={{color: colors.bleuFbi}}>Cherchez-vous un produit (article, location ou service) que vous n'avez pas trouvé dans nos espaces? Proposez ici.</AppText>
                        </View>
                    </View>
                    <View style={styles.planContainer}>
                        <Image source={require('../assets/suggestion.jpg')} style={{height: 200, width: 200}}/>
                        <MaterialCommunityIcons name="hand-pointing-right" size={40} color="black" />
                        <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold', fontSize: 20}}>Propositions</AppText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    planContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        width: '100%',
        marginBottom: 40
    }
})

export default PlanPropositionScreen;
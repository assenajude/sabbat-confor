import React from 'react';
import {View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AppText from "../AppText";
import useAuth from "../../hooks/useAuth";

function StatusPicker({labelStatus, statusData, statusValue, changeStatusValue, otherStatusStyle}) {
    const {userRoleAdmin} = useAuth()
    return (
        <View style={{
            flexDirection: 'row'
        }}>
            <AppText style={{fontWeight: 'bold', fontSize: 18}}>{labelStatus} </AppText>
            {userRoleAdmin() &&
            <Picker style={[{height: 50, width: 150}, otherStatusStyle]} selectedValue={statusValue} onValueChange={(value) => changeStatusValue(value)}>
                {statusData.map((item, index) =><Picker.Item label={item} value={item} key={index.toString()}/>)}
            </Picker>}
            {!userRoleAdmin() && <AppText>{statusValue}</AppText>}
        </View>
    );
}

export default StatusPicker;
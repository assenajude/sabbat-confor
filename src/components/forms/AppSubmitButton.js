import React from 'react';
import {useFormikContext} from 'formik'

import AppButton from "../AppButton";

function AppSubmitButton({title,iconName,height=50, style, labelStyle}) {
    const {handleSubmit} = useFormikContext()
    return (
          <AppButton
              contentStyle={{height: height}}
              style={[{marginHorizontal: 20},style]}
              labelStyle={labelStyle}
              iconName={iconName}
              onPress={handleSubmit}
              title={title} />
    );
}
export default AppSubmitButton;
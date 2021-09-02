import React from 'react';
import {useFormikContext} from 'formik'

import AppButton from "../AppButton";

function AppSubmitButton({title,iconName, style, labelStyle}) {
    const {handleSubmit} = useFormikContext()
    return (
          <AppButton
              style={[{marginHorizontal: 20},style]}
              labelStyle={labelStyle}
              iconName={iconName}
              onPress={handleSubmit}
              title={title} />
    );
}
export default AppSubmitButton;
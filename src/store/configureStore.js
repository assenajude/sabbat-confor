import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';


import rootReducer from "./rootReducer";
import api from "./middlewares/api";


export default function() {
    return configureStore({
      /*  reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: api,
                },
                serializableCheck: false,
            }),*/
        reducer: rootReducer,
        middleware: [
            ...getDefaultMiddleware(),
            api
        ],
    })
}
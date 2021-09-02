import {combineReducers} from 'redux';
import authSlice from '../store/slices/authSlice'
import profileSlice from '../store/slices/userProfileSlice'
import s3_uploadSlice from './slices/s3_directUploadSlice'

import entitiesReducers from "./entitiesReducers";

export default combineReducers({
    entities: entitiesReducers,
    auth: authSlice,
    profile: profileSlice,
    s3_upload: s3_uploadSlice
})
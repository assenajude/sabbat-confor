import * as SecureStore from "expo-secure-store";
import jwtDecode from 'jwt-decode'
import dayjs from "dayjs";

const tokenKey = 'authToken'

const expireIn = (user) => {
    const creationDate = dayjs(user.iat)
    const maxDate = user.exp
    const now = dayjs()
    const difference = now.diff(creationDate, 'second')
    const isExpired = difference > maxDate
    return isExpired
}

const storeToken  = async authToken => {
    try{
    await SecureStore.setItemAsync(tokenKey, authToken)
    } catch (e) {
        throw new Error(`error: ${e}`)
    }
}



const getStoredToken = async () => {
    try {
        return SecureStore.getItemAsync(tokenKey)
    } catch (e) {
        throw new Error(`error: ${e}`)

    }
}


const removeToken = async () => {
    try{
        await SecureStore.deleteItemAsync(tokenKey)
    } catch (e) {
        throw new Error(`error: ${e}`)
    }
}

const getUser = async () => {
    try{
        const token = await getStoredToken()
        if(!token) return null
        const user = jwtDecode(token)
        const isExpired = expireIn(user)
        if(isExpired) {
            await removeToken()
            return null;
        }
        return user
        //return token? jwtDecode(token): null
    } catch (e) {
        throw new Error(`error: ${e}`)
    }
}


export default {getStoredToken,getUser, storeToken, removeToken}
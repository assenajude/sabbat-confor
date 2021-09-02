
import * as Sentry from 'sentry-expo'


const start = () => {
    Sentry.init({
        dsn: 'https://041b76d24a8a472c9a81e114fb3c7173@o541240.ingest.sentry.io/5911108',
        enableInExpoDevelopment: true,
        debug:__DEV__?true:false
    })
}

// const log = (error) => Sentry.captureException(new Error(error))


export default {start}
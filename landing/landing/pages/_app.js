import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import './index.css'
import '@fontsource/roboto'
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

function MyApp({Component, pageProps}) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}

export default MyApp

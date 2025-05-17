import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';
import buildClient from '../api/build-client';

function MyApp({ Component, pageProps, currentUser }) {
    return (
        <>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component {...pageProps} />
            </div>
        </>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, currentUser: data.currentUser };
}

export default MyApp;
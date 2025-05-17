import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';
import buildClient from '../api/build-client';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <div className='container'>
                <Component {...pageProps} />
            </div>
        </Layout>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    console.log(pageProps);
    return { pageProps: data };
}

export default MyApp;
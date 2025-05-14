import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <div className='container'>
                <Component {...pageProps} />
            </div>
        </Layout>
    );
}

export default MyApp;
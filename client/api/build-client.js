import axios from 'axios';

/**
 * Returns an axios instance that is either bound to the request for server-side
 * rendering or the browser for client-side rendering.
 *
 * @param {Object} [params] - Optional object with a `req` property to forward the
 *   headers from the request.
 *
 * @returns {AxiosInstance}
 */
const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};

export default buildClient;
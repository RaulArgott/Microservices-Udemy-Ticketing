import axios from "axios";
import { useState } from "react";

/**
 * A custom React hook for making HTTP requests.
 *
 * @param {Object} config - Configuration object for the request.
 * @param {string} config.url - The URL to send the request to.
 * @param {string} config.method - The HTTP method to use (e.g., 'get', 'post').
 * @param {Object} [config.body] - The body of the request, if applicable.
 * @param {Function} [config.onSuccess] - Optional callback function to be called on successful response.
 *
 * @returns {Object} An object containing the `doRequest` function to initiate the request and `errors` to display any errors.
 */

export const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    /**
     * Initiates the request. If the request is successful, the callback passed to `onSuccess` will be called with the response data.
     * If there is an error, the `errors` state will be updated with an error message.
     *
     * @param {Object} [props] - Optional properties to pass along in the request body.
     *
     * @returns {Promise<Object | undefined>} A promise that resolves to the response data if the request is successful.
     * If the request fails, the promise will resolve to undefined.
     */
    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, { ...body, ...props });

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
};

export default useRequest;
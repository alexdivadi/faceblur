import { useState, useCallback } from 'react';

const useAsync = (asyncFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await asyncFunction(...args);
                setResult(response);
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction]
    );

    return { loading, error, result, execute };
};

export default useAsync;

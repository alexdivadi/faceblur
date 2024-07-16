import React from 'react';
import useAsync from "./useAsync.js";

function AsyncButton({
    title,
    onClick,
}) {
    const { loading, error, result: _, execute } = useAsync(onClick);
    return <button
        onClick={loading ? null : execute}
        className={`text-white font-bold py-4 px-8 mt-4 rounded  text-2xl
        ${loading ? 'opacity-50 pointer-events-none bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'}`}
        disabled={loading}
    >

        {!error && (loading ? "Loading..." : title)}
        {error && <span className="text-red-800 ml-2">Error: {error.message ?? "Something went wrong."} Retry</span>}
    </button>

}

export default AsyncButton;
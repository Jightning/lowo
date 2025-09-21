'use client'

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import {
    fetchSnippets,
    selectSnippets,
    selectSnippetsStatus,
    selectSnippetsError
} from '@/lib/features/SnippetsSlice';

const SnippetsList = () => {
    // Use the pre-typed hooks from your hooks.ts file
    const dispatch = useAppDispatch();

    // Select the necessary data from the Redux store
    const snippets = useAppSelector(selectSnippets);
    const status = useAppSelector(selectSnippetsStatus);
    const error = useAppSelector(selectSnippetsError);

    // Dispatch the async thunk when the component mounts
    useEffect(() => {
        // We only fetch if the status is 'idle' to prevent re-fetching
        if (status === 'idle') {
            dispatch(fetchSnippets());
        }
    }, [status, dispatch]);

    // Render UI based on the current status
    if (status === 'pending') {
        return <div>Loading snippets...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>My Snippets</h2>
            <ul>
                {snippets.map(snippet => (
                    <li key={snippet.id}>
                        <h3>{snippet.title}</h3>
                        {/* You can render snippet content here */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SnippetsList;
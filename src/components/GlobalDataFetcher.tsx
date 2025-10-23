'use client'

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { 
    fetchSnippets, 
    selectSnippetsStatus 
} from '@/lib/features/SnippetsSlice';
import { 
    fetchCategories, 
    selectCategoriesStatus 
} from '@/lib/features/CategoriesSlice';
import { fetchUser, selectUserStatus } from '@/lib/features/UserSlice';
import { selectIsAuthenticated } from '@/lib/features/UserSlice';
import { StatusType } from '@/types';

const GlobalDataFetcher = () => {
    const dispatch = useAppDispatch();
    const snippetsStatus = useAppSelector(selectSnippetsStatus);
    const categoriesStatus = useAppSelector(selectCategoriesStatus);
    const userStatus = useAppSelector(selectUserStatus)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    useEffect(() => {
        if (snippetsStatus === StatusType.IDLE) {
            dispatch(fetchSnippets());
        }
    }, [snippetsStatus, dispatch]);

    useEffect(() => {
        if (categoriesStatus === StatusType.IDLE) {
            dispatch(fetchCategories());
        }
    }, [categoriesStatus, dispatch]);

    useEffect(() => {
        if (userStatus === StatusType.IDLE) {
            dispatch(fetchUser());
        }
    }, [userStatus, dispatch]);

    // Re-fetching data when authentication status changes
    // TODO maybe there's a better way - this is ok, since as the others load a pending state is sent which prevents multiple fetches
    useEffect(() => {
        if (!isAuthenticated) return;
        
        // If it failed, but the user is authenticated, we will try fetching again
        if (snippetsStatus === StatusType.IDLE || snippetsStatus === StatusType.FAILED) {
            dispatch(fetchSnippets());
        }

        if (categoriesStatus === StatusType.IDLE || categoriesStatus === StatusType.FAILED) {
            dispatch(fetchCategories());
        }
        // Maybe not necessary
        if (userStatus === StatusType.IDLE || userStatus === StatusType.FAILED) {
            dispatch(fetchUser());
        }

    }, [isAuthenticated, dispatch]);

    return null;
};

export default GlobalDataFetcher;

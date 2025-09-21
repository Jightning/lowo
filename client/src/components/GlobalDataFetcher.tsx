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


const GlobalDataFetcher: React.FC = () => {
    const dispatch = useAppDispatch();
    const snippetsStatus = useAppSelector(selectSnippetsStatus);
    const categoriesStatus = useAppSelector(selectCategoriesStatus);

    useEffect(() => {
        if (snippetsStatus === 'idle') {
            dispatch(fetchSnippets());
        }
    }, [snippetsStatus, dispatch]);

    useEffect(() => {
        if (categoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [categoriesStatus, dispatch]);

    return null;
};

export default GlobalDataFetcher;

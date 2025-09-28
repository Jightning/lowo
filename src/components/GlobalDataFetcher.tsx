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
import { getToken } from "@/lib/session";
import { fetchUser, selectUserStatus, setIsAuthenticated } from '@/lib/features/UserSlice';
import { StatusType } from '@/types';

const db = process.env.NEXT_PUBLIC_DB_ROUTE

const GlobalDataFetcher: React.FC = () => {
    const dispatch = useAppDispatch();
    const snippetsStatus = useAppSelector(selectSnippetsStatus);
    const categoriesStatus = useAppSelector(selectCategoriesStatus);
    const userStatus = useAppSelector(selectUserStatus)

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

    useEffect(() => {
	    const checkToken = async () => {
	        const token = await getToken();

	        dispatch(setIsAuthenticated(!!token));
	    };

	    checkToken();
	}, [dispatch]);


    return null;
};

export default GlobalDataFetcher;

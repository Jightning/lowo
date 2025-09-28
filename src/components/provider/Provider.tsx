'use client'

import { useRef } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'

export default function Provider({
    children
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <ReduxProvider store={storeRef.current}>
            {children}
        </ReduxProvider>
    )
}
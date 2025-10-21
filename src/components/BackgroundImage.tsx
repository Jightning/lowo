'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function BackgroundImage({ src, alt }: { src: string, alt?: string }){
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        const el = wrapperRef.current
        if (!el) return

        let ticking = false
        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(()=>{
                const scrolled = window.scrollY
                const scale = 1 + Math.min(scrolled / 2000, 0.15)
                el.style.transform = `scale(${scale})`
                ticking = false
            })
        }

        el.style.transform = 'scale(1)'
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div ref={wrapperRef} className="fixed inset-0 -z-10 will-change-transform transition-transform duration-200 ease-out">
            <Image
                alt={alt || 'Background'}
                src={src}
                fill
                sizes="100vw"
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/30" />
        </div>
    )
}

'use client'

import React, { useEffect, useRef } from 'react';

interface HighlightedCodeProps {
    content: string;
}

export const HighlightedCode: React.FC<HighlightedCodeProps> = ({ content }) => {
    const codeEl = useRef<HTMLElement>(null);
    useEffect(() => {
        if (codeEl.current && (window as any).hljs) {
            try {
                (window as any).hljs.highlightElement(codeEl.current);
            } catch (e) {
                console.error("highlight.js error:", e);
            }
        }
    }, [content]);

    // The highlight.js theme provides padding, background, and text colors.
    // We provide layout classes for text wrapping and sizing.
    return (
        <pre className="whitespace-pre-wrap break-words text-sm"><code ref={codeEl} className="rounded-md">{content}</code></pre>
    );
};

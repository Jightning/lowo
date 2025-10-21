import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const HighlightedCode = (
    { children, className, background=false, clampLines=0 }: 
    { children: any, className?: string, background?: boolean, clampLines?: number }
) => {
    const clampStyle: React.CSSProperties | undefined = clampLines > 0 ? {
        display: '-webkit-box',
        WebkitLineClamp: clampLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } as React.CSSProperties : undefined;
    
    return (
        <SyntaxHighlighter 
            language={"jsx"} 
            className={"rounded-md !my-0 " + className} 
            customStyle={
                background ? {} : { background: "transparent", ...(clampStyle || {})}
            } 
            style={coldarkDark}
        >
			{children}
		</SyntaxHighlighter>
    )
}
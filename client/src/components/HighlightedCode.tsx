import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export const HighlightedCode = ({ children, background=false, clampLines=0}: { children: any, background?: boolean, clampLines?: number }) => {
    const clampStyle: React.CSSProperties | undefined = clampLines > 0 ? {
        display: '-webkit-box',
        WebkitLineClamp: clampLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } as React.CSSProperties : undefined;
    
    return (
        <SyntaxHighlighter 
            language={"javascript"} 
            className="rounded-md !my-0" 
            customStyle={background ? {} : { background: "transparent", ...(clampStyle || {})}} style={coldarkDark}>
			{children}
		</SyntaxHighlighter>
    )
}
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export const HighlightedCode = ({ children, background=false }: { children: any, background?: boolean }) => {
    return (
        <SyntaxHighlighter language={"javascript"} customStyle={background ? {} : { background: "transparent" }} style={coldarkDark}>
			{children}
		</SyntaxHighlighter>
    )
}
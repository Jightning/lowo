import React, { useRef, forwardRef } from 'react';

// Textbox with some more custom behavior - currently only for allowing tab
export const AdvancedTextbox = forwardRef(({ ...props }: any, ref) => {
	const localRef = useRef(null);
	const textareaRef = ref || localRef;
	
	const handleKeyDown = (event: any) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			
			const { selectionStart, selectionEnd } = event.target;
			const value = event.target.value;
			
			const newValue =
				value.substring(0, selectionStart) +
				'\t' +
				value.substring(selectionEnd);

			event.target.value = newValue
			props.onChange(event)
			
			event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
		}

		if (props.onKeyDown) {
			props.onKeyDown(event);
		}
	};
	
	return (
		<textarea
			ref={textareaRef}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
});
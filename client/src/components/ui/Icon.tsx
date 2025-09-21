import React from 'react';

interface IconProps {
	name?: string;
	fill?: string;
	className?: string;
}

const Icon = ({ name, fill, className = 'w-6 h-6' }: IconProps) => {
	// To add an icon, just find its corresponding path and add here under the name you choose
	// These use a viewbox of 0 -960 960 960 from google material icons, you can adjust the viewbox through its variable below
	const icons: { [key: string]: React.ReactElement } = {
		more: <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />, 
		copy: <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />,
		code: <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />,
		text: <path d="M200-200h560v-367L567-760H200v560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h400l240 240v400q0 33-23.5 56.5T760-120H200Zm80-160h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h280v-80H280v80Zm-80 400v-560 560Z" />,
		basic: <circle cx="12" cy="12" r="10" />
	};
	
	let viewBox = "0 -960 960 960";
	if (!name || !icons[name]) {
		name = "basic"
		viewBox = '0 0 24 24'
	} else if (name === 'more') {
		viewBox = "100 -580 760 200";
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill={fill || "#353B48"} className={className}>
			{icons[name]}
		</svg>
	);
};

export default Icon;
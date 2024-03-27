const Footer: React.FC = () => {
	return (
		<div className="bg-white rounded-t-xl">
			<div className="p-2 text-center">
				© {new Date().getFullYear()} Bytes2Pro. All rights reserved.
			</div>
		</div>
	);
};

export default Footer;

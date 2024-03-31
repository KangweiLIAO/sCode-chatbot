import React from 'react';
import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="fixed bg-opacity-50 backdrop-filter backdrop-blur-lg bg-white top-0 left-0 right-0 z-50 p-2
		shadow-lg shadow-indigo-700/10">
			<div className="mx-auto px-6">
				<div className="flex justify-between items-center py-2">
					<div className="text-2xl text-gray-700 font-sans select-none">
						sCode
					</div>
					{/* Add navigation links or buttons here */}
					<div>
						<Link href="/"
						      className="mx-2 px-2 py-2 font-light text-slate-500 hover:text-indigo-950 select-none">
							Chat
						</Link>
						<Link href={"/about"}
						      className="mx-2 px-2 py-2 font-light text-slate-500 hover:text-indigo-950 select-none">
							About
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};
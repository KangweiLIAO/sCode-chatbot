import React from 'react';
import Link from 'next/link';

export default function About() {
	return (
		<div className="min-h-screen bg-gray-300 flex flex-col justify-center">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						About <span className="text-indigo-600">sCode</span>
					</h2>
					<p className="mt-10 text-lg leading-6 text-gray-600 text-justify">
						<span className="text-indigo-600">sCode</span> is an innovative <span
						className="font-bold">coding assistant chatbot</span>, crafted to support developers by elucidating <span
						className="font-bold">coding concepts</span> and crafting <span
						className="font-bold">code snippets</span> across various programming languages. It&#39;s your go-to
						companion for navigating through the intricacies of coding, offering help whether you&#39;re encountering
						a challenging problem or diving into new topics. sCode leverages cutting-edge technology to provide accurate
						and context-aware guidance, making the coding journey smoother and more enjoyable.
					</p>
					<p className="mt-8 mb-24 text-lg leading-6 text-gray-600 text-justify">
						Powered by a robust tech stack, sCode combines the efficiency of <span
						className="font-bold">Next.js and Vercel</span> for the frontend, <span
						className="font-bold"> FastAPI and Heroku</span> for the backend services, and utilizes the <span
						className="font-bold">Google/Gemma-7B model</span> for generating code snippets. Natural Language
						Understanding (NLU) is enhanced with <span className="font-bold">Dialogflow</span>, ensuring <span
						className="text-indigo-600">sCode</span> understands and responds to a wide range of
						developer inquiries with precision.
					</p>
				</div>
				<div className="mt-8 flex justify-center">
					<div className="inline-flex rounded-md shadow">
						<Link href="/"
						      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base
                              font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

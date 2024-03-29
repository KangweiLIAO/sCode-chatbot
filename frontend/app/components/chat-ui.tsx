'use client'

import React, {useState} from 'react';
import TypeIt from "typeit-react";

// const FETCH_URL = 'http://localhost:8000/dialogflow'
const FETCH_URL = 'https://scode-chatbot-236603824520.herokuapp.com/dialogflow'

interface Message {
	id: number;
	text: string;
	sender: 'user' | 'bot';
}

export default function ChatUI() {
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dialog, setDialog] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');

	const handleSend = async () => {
		if (!inputText.trim()) return; // don't send empty messages

		const newMessage: Message = {
			id: Date.now(),
			text: inputText,
			sender: 'user',
		};

		// Add the user's message to the conversation and clear the input field
		setDialog(messages => [...messages, newMessage]);
		setInputText(''); // Clear the input field

		try {
			// setIsLoading(true)
			// Send the user's message to the backend
			const response = await fetch(FETCH_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Tell the server we're sending JSON
				},
				body: JSON.stringify(newMessage), // Send the user's message as JSON
			});

			const botMessage = await response.json(); // Parse the JSON response
			// Update the conversation with the new response
			setDialog(messages => [...messages, botMessage]);
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			// setIsLoading(false)
		}
	};

	// @ts-ignore
	return (
		<main className="flex flex-col h-screen bg-gray-300 pt-20">
			<div className="flex-grow overflow-auto p-4 space-y-2">
				{dialog.map((message, index) => (
					// Display each message in the conversation
					<div key={index}
					     className={`p-2 ${message.sender === 'user' ? 
						     'p-3 bg-blue-800 text-white self-end rounded-lg animate-popIn'
						     : 'p-3 border-2 border-blue-950 text-blue-950 self-start rounded-lg animate-popIn'}`}>
						{message.sender === 'bot' ? (
							<TypeIt options={{
								strings: [message.text],
								speed: 3,
								waitUntilVisible: true,
								cursor: false
							}}
							/>
						) : (
							<p>{message.text}</p>
						)}
					</div>
				))}
			</div>
			{/* Text Field */}
			<div className="p-4">
				<div
					className="flex w-full flex-row items-center gap-2 rounded-[24px] border border-gray-900/10 bg-gray-900/5 p-2">
					<div className="relative grid h-full w-full min-w-[200px]">
						<input
							value={inputText}
							placeholder="Message sCode..."
							className="peer h-full min-h-full w-full rounded-[7px]  !border-0 border-blue-gray-200
                border-t-transparent bg-transparent px-3 py-2.5 font-sans text-lg text-blue-900 font-normal
                text-blue-gray-700 outline outline-0 transition-all placeholder:text-blue-gray-300
                placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200
                focus:border-2 focus:ring-purple-600 focus:border-transparent focus:border-t-transparent focus:outline-0
                disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
							onChange={(e) => setInputText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSend()}
							// disabled={isLoading}
						></input>
					</div>
					<div>
						<button
							className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle
							font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20
							disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							onClick={handleSend}
							// disabled={isLoading}
							type="button">
				      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
				        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				          <path
					          d="M12.9576 7.71521C13.0903 7.6487 13.2019 7.54658 13.2799 7.42027C13.3579 7.29396 13.3992 7.14845
					          13.3992 7.00001C13.3992 6.85157 13.3579 6.70606 13.2799 6.57975C13.2019 6.45344 13.0903 6.35132 12.9576
					          6.28481L1.75762 0.684812C1.61875 0.615327 1.46266 0.587759 1.30839 0.605473C1.15412 0.623186 1.00834
					          0.685413 0.888833 0.784565C0.769325 0.883716 0.681257 1.01551 0.635372 1.16385C0.589486 1.3122 0.587767
					          1.4707 0.630424 1.62001L1.77362 5.62001C1.82144 5.78719 1.92243 5.93424 2.06129 6.03889C2.20016 6.14355
					          2.36934 6.20011 2.54322 6.20001H6.20002C6.4122 6.20001 6.61568 6.2843 6.76571 6.43433C6.91574 6.58436
					          7.00002 6.78784 7.00002 7.00001C7.00002 7.21218 6.91574 7.41567 6.76571 7.5657C6.61568 7.71573 6.4122
					          7.80001 6.20002 7.80001H2.54322C2.36934 7.79991 2.20016 7.85647 2.06129 7.96113C1.92243 8.06578 1.82144
					          8.21283 1.77362 8.38001L0.631223 12.38C0.588482 12.5293 0.590098 12.6877 0.635876 12.8361C0.681652
					          12.9845 0.769612 13.1163 0.889027 13.2155C1.00844 13.3148 1.15415 13.3771 1.30838 13.3949C1.46262
					          13.4128 1.61871 13.3854 1.75762 13.316L12.9576 7.71601V7.71521Z"
					          fill="#90A4AE"></path>
				        </svg>
				      </span>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

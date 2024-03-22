'use client'

import React, {useState} from 'react';

interface Message {
	id: number;
	text: string;
	sender: 'user' | 'bot';
}

export default function ChatUI() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');

	const handleSend = () => {
		if (!inputText.trim()) return;
		const newMessage: Message = {
			id: Date.now(),
			text: inputText,
			sender: 'user',
		};
		setMessages([...messages, newMessage]);
		setInputText('');

		// Simulate bot response
		setTimeout(() => {
			const botMessage: Message = {
				id: Date.now(),
				text: 'Hello! This is a response from the bot.',
				sender: 'bot',
			};
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		}, 1000);
	};

	return (
		<main className="flex flex-col h-screen bg-gray-900">
			<div className="flex-grow overflow-auto p-4 space-y-2">
				{messages.map((message) => (
					<div key={message.id}
					     className={`p-2 ${message.sender === 'user' ? 'p-3 bg-blue-900 text-white self-end rounded-lg'
						     : 'p-3 border border-l-amber-50 text-amber-50 self-start rounded-lg'}`}>
						{message.text}
					</div>
				))}
			</div>
			<div className="p-4">
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					className="border border-transparent p-3 pt-4 pb-4 w-full text-black rounded-lg focus:outline-none focus:ring-2
						focus:ring-purple-600 focus:border-transparent"
					placeholder="Type a message..."
					onKeyPress={(e) => e.key === 'Enter' && handleSend()}
				/>
				<button onClick={handleSend}
				        className="w-full mt-3 py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700">
					Send
				</button>
			</div>
		</main>
	);
};

import ChatUI from "@/app/components/chat-ui";
import Navbar from "@/app/components/navbar";

export default function Home() {
	return (
		<>
			<Navbar/>
			<main>
				<ChatUI/>
			</main>
		</>
	);
}

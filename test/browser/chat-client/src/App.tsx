import React from 'react';
import './App.css';
import { ChatMessageList } from "./ChatMessageList";


function App()
{
	return (
		<div className="App">
			<div className="App-body">
				<ChatMessageList
					serverUrl="localhost:6612"
					roomId="g0x827321bdda13dce855ab6f8a52952cc9bd0574ba"/>
			</div>
		</div>
	);
}

export default App;

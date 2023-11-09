import React from 'react';
import _ from 'lodash';
import './App.css';
import {
	MsgType,
	ChatType,
	ClientConnect,
	JoinRoomRequest, LeaveRoomRequest, LeaveRoomResponse,
	ReceiveMessageCallback,
	ResponseCallback,
	RoomUtil, SendMessageRequest, ChatMessage
} from "denetwork-chat-client";
import { EtherWallet, TWalletBaseItem, Web3Digester, Web3Signer } from "web3id";


interface ChatMessageListProps
{
	// messages: Array<ChatMessage>;
}

interface ChatMessageListState
{
	messages : Array<ChatMessage>;
	value : string;
}

class ChatMessageList extends React.Component<ChatMessageListProps, ChatMessageListState>
{
	//
	//	create a wallet by mnemonic
	//
	mnemonic : string = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
	walletObj : TWalletBaseItem = EtherWallet.createWalletFromMnemonic( this.mnemonic );

	//const randomRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );
	randomRoomId = `g0x827321bdda13dce855ab6f8a52952cc9bd0574ba`;
	chatMessageList : Array<ChatMessage> = [];
	clientConnect ! : ClientConnect;

	receiveMessageCallback : ReceiveMessageCallback = ( message : SendMessageRequest, callback ? : ( ack : any ) => void ) =>
	{
		console.log( `ReceiveMessageCallback received a message: `, message );
		if ( _.isObject( message ) && _.has( message, 'payload' ) )
		{
			this.chatMessageList.unshift( message.payload );
			this.setState( {
				messages : this.chatMessageList
			} );
			console.log( `chatMessageList:`, this.chatMessageList );
		}
		else
		{
			throw new Error( `invalid message` );
		}

		if ( _.isFunction( callback ) )
		{
			callback( 200 );
		}
	}


	constructor( props : any )
	{
		super( props );
		this.state = {
			messages : [],
			value : 'Hi, can you hear me?'
		};
		//	...
		this.clientConnect = new ClientConnect( `localhost:6612`, this.receiveMessageCallback );

		//	...
		this.onClickJoinRoom = this.onClickJoinRoom.bind( this );
		this.onClickLeaveRoom = this.onClickLeaveRoom.bind( this );
		this.onClickSendMessage = this.onClickSendMessage.bind( this );
		this.handleValueChange = this.handleValueChange.bind( this );
	}

	componentDidMount()
	{
		this.joinChatRoom();
	}

	private joinChatRoom()
	{
		const callback : ResponseCallback = ( response : any ) : void =>
		{
			console.log( `💎 join room response: `, response );
		};
		this.clientConnect.joinRoom( {
			roomId : this.randomRoomId
		} as JoinRoomRequest, callback );
	}

	onClickJoinRoom( e : any )
	{
		e.preventDefault();
		this.joinChatRoom();
	}

	onClickLeaveRoom( e : any )
	{
		e.preventDefault();
		const callback : ResponseCallback = ( response : LeaveRoomResponse ) : void =>
		{
			console.log( `🌶️ leave room response: `, response );
		};
		this.clientConnect.leaveRoom( {
			roomId : this.randomRoomId
		} as LeaveRoomRequest, callback );
	}

	async asyncSendMessage()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const callback : ResponseCallback = ( response : any ) : void =>
				{
					console.log( `🍔 send message response: `, response );
				};
				let chatMessage : ChatMessage = {
					msgType : MsgType.SEND,
					chatType : ChatType.GROUP,
					wallet : this.walletObj.address,
					fromName : `XING`,
					fromAvatar : `https://www.avatar.com/aaa.jgp`,
					roomId : this.randomRoomId,
					body : this.state.value,
					timestamp : new Date().getTime(),
					hash : '',
					sig : '',
				};
				chatMessage.sig = await Web3Signer.signObject( this.walletObj.privateKey, chatMessage );
				chatMessage.hash = await Web3Digester.hashObject( chatMessage );
				const sendMessageRequest : SendMessageRequest = {
					payload : chatMessage
				}
				console.log( `will send message: `, sendMessageRequest );
				this.clientConnect.sendMessage( sendMessageRequest, callback );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	onClickSendMessage( e : any )
	{
		e.preventDefault();
		this.asyncSendMessage().then( res =>
		{
			console.log( `onClickSendMessage :`, res );
		} ).catch( err =>
		{
			console.error( `onClickSendMessage :`, err );
		} )
	}

	handleValueChange( e : any )
	{
		this.setState( { value : e.target.value } );
	}

	render()
	{
		const messages = this.state.messages;
		const listItems = messages.map( ( item : any ) =>
			<li key={ item.hash }>
				{ item.fromName } / { new Date( item.timestamp ).toLocaleString() }
				<br/>
				{ item.body }
				<hr/>
			</li>
		);
		return (
			<div>
				<div>roomId: { this.randomRoomId }</div>
				<div>
					<button onClick={ this.onClickJoinRoom }>Join</button>
					&nbsp;
					<button onClick={ this.onClickLeaveRoom }>Leave</button>
					&nbsp;
					<input className="MessageInput"
					       value={ this.state.value }
					       onChange={ this.handleValueChange }></input>
					<button onClick={ this.onClickSendMessage }>Send</button>
				</div>
				<div className="ChatArea">
					<ul className="ChatMessageListUl">{ listItems }</ul>
				</div>
			</div>
		);
	}
}


function App()
{
	return (
		<div className="App">
			<div className="App-body">
				<ChatMessageList/>
			</div>
		</div>
	);
}

export default App;

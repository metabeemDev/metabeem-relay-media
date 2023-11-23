import request from "supertest";
import { app, startHttpServer } from "../../src/http/http.js";
import { describe, expect } from "@jest/globals";
import { EtherWallet, Web3Digester, Web3Signer } from "web3id";
import { ERefDataTypes, FavoriteService, FollowerService, LikeService, PostService, SchemaUtil } from "denetwork-store";
import { TestUtil } from "denetwork-utils";
import _ from "lodash";

let server = null;


/**
 *    define test users
 */
export const testUserList = [
	{
		id : 1,
		name : 'Alice',
		mnemonic : 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
	},
	{
		id : 2,
		name : 'Bob',
		mnemonic : 'evidence cement snap basket genre fantasy degree ability sunset pistol palace target',
	},
	{
		id : 3,
		name : 'Mary',
		mnemonic : 'electric shoot legal trial crane rib garlic claw armed snow blind advance',
	}
];
export const testUserAlice = 0;
export const testUserBob = 1;
export const testUserMary = 2;


describe( 'PortalController', () =>
{
	let walletObj;
	let lastOneAddress;
	let savedPost;

	const statisticKeys = SchemaUtil.getPrefixedKeys( `post`, 'statistic' );
	const exceptedKeys = Array.isArray( statisticKeys ) ? statisticKeys : [];


	beforeAll( async () =>
	{
		if ( null === server )
		{
			server = await startHttpServer();
		}

		//
		//	will clear data
		//
		const postService = new PostService();
		await postService.clearAll();

		const favoriteService = new FavoriteService();
		await favoriteService.clearAll();

		const likeService = new LikeService();
		await likeService.clearAll();

		const followerService = new FollowerService();
		await followerService.clearAll();
	} );
	afterAll( async () =>
	{
		//
		//	close http server
		//
		return new Promise( ( resolve ) =>
		{
			server.close( () =>
			{
				//console.log( 'Http Server is closed' );
				resolve();	// Test has been completed
			} );
		} );
	} );


	describe( "Test recommended portal", () =>
	{
		it( "should create some posts, and then favorite and like them", async () =>
		{
			for ( let i = 0; i < 500; i++ )
			{
				//	randomly, choose a user
				walletObj = EtherWallet.createWalletFromMnemonic( testUserList[ new Date().getTime() % 3 ].mnemonic );
				expect( walletObj ).not.toBeNull();
				expect( EtherWallet.isValidPrivateKey( walletObj.privateKey ) ).toBeTruthy();
				expect( EtherWallet.isValidPublicKey( walletObj.publicKey ) ).toBeTruthy();
				expect( EtherWallet.isValidAddress( walletObj.address ) ).toBeTruthy();

				let post = {
					timestamp : new Date().getTime(),
					hash : '',
					version : '1.0.0',
					deleted : SchemaUtil.createHexStringObjectIdFromTime( 0 ),
					wallet : walletObj.address,
					sig : ``,
					authorName : 'XING',
					authorAvatar : 'https://avatars.githubusercontent.com/u/142800322?v=4',
					body : 'Hello 1',
					pictures : [],
					videos : [],
					bitcoinPrice : '25888',
					statisticView : 0,
					statisticRepost : 0,
					statisticQuote : 0,
					statisticLike : 0,
					statisticFavorite : 0,
					statisticReply : 0,
					remark : 'no ...',
					createdAt : new Date(),
					updatedAt : new Date()
				};
				post.sig = await Web3Signer.signObject( walletObj.privateKey, post, exceptedKeys );
				post.hash = await Web3Digester.hashObject( post );
				expect( post.sig ).toBeDefined();
				expect( typeof post.sig ).toBe( 'string' );
				expect( post.sig.length ).toBeGreaterThanOrEqual( 0 );

				let response = await request( app )
					.post( '/v1/post/add' )
					.send( {
						wallet : walletObj.address, data : post, sig : post.sig
					} );
				//console.log( response );
				expect( response ).toBeDefined();
				expect( response ).toHaveProperty( 'statusCode' );
				expect( response ).toHaveProperty( '_body' );
				expect( response.statusCode ).toBe( 200 );
				expect( response._body ).toBeDefined();
				expect( response._body ).toHaveProperty( 'version' );
				expect( response._body ).toHaveProperty( 'ts' );
				expect( response._body ).toHaveProperty( 'tu' );
				expect( response._body ).toHaveProperty( 'error' );
				expect( response._body ).toHaveProperty( 'data' );
				expect( response._body.data ).toBeDefined();
				expect( response._body.data ).toHaveProperty( 'hash' );
				expect( response._body.data.hash ).toBe( post.hash );

				//	...
				savedPost = _.cloneDeep( response._body.data );

				//
				//	randomly, choose a user and favorite the post we just created
				//
				walletObj = EtherWallet.createWalletFromMnemonic( testUserList[ new Date().getTime() % 3 ].mnemonic );
				expect( walletObj ).not.toBeNull();
				expect( EtherWallet.isValidPrivateKey( walletObj.privateKey ) ).toBeTruthy();
				expect( EtherWallet.isValidPublicKey( walletObj.publicKey ) ).toBeTruthy();
				expect( EtherWallet.isValidAddress( walletObj.address ) ).toBeTruthy();

				let favorite = {
					timestamp : new Date().getTime(),
					hash : '',
					version : '1.0.0',
					deleted : SchemaUtil.createHexStringObjectIdFromTime( 0 ),
					wallet : walletObj.address,
					refType : ERefDataTypes.post,
					refHash : savedPost.hash,
					refBody : '',
					sig : ``,
					remark : 'no remark',
					createdAt : new Date(),
					updatedAt : new Date()
				};
				favorite.sig = await Web3Signer.signObject( walletObj.privateKey, favorite, exceptedKeys );
				favorite.hash = await Web3Digester.hashObject( favorite );
				expect( favorite.sig ).toBeDefined();
				expect( typeof favorite.sig ).toBe( 'string' );
				expect( favorite.sig.length ).toBeGreaterThanOrEqual( 0 );

				response = await request( app )
					.post( '/v1/favorite/add' )
					.send( {
						wallet : walletObj.address, data : favorite, sig : favorite.sig
					} );
				expect( response ).toBeDefined();
				expect( response ).toHaveProperty( 'statusCode' );
				expect( response ).toHaveProperty( '_body' );
				if ( 200 !== response.statusCode )
				{
					console.log( response );
				}
				expect( response.statusCode ).toBe( 200 );
				expect( response._body.data ).toBeDefined();
				expect( response._body.data ).toHaveProperty( '_id' );
				expect( response._body.data ).toHaveProperty( 'hash' );
				expect( response._body.data ).toHaveProperty( 'wallet' );
				expect( response._body.data ).toHaveProperty( 'refHash' );
				expect( response._body.data.hash ).toBe( favorite.hash );
				expect( response._body.data.sig ).toBe( favorite.sig );


				//
				//	randomly, choose a user and like the post we just created
				//
				walletObj = EtherWallet.createWalletFromMnemonic( testUserList[ new Date().getTime() % 3 ].mnemonic );
				expect( walletObj ).not.toBeNull();
				expect( EtherWallet.isValidPrivateKey( walletObj.privateKey ) ).toBeTruthy();
				expect( EtherWallet.isValidPublicKey( walletObj.publicKey ) ).toBeTruthy();
				expect( EtherWallet.isValidAddress( walletObj.address ) ).toBeTruthy();

				let like = {
					timestamp : new Date().getTime(),
					hash : '',
					version : '1.0.0',
					deleted : SchemaUtil.createHexStringObjectIdFromTime( 0 ),
					wallet : walletObj.address,
					refType : ERefDataTypes.post,
					refHash : savedPost.hash,
					refBody : '',
					sig : ``,
					remark : 'no remark',
					createdAt : new Date(),
					updatedAt : new Date()
				};
				like.sig = await Web3Signer.signObject( walletObj.privateKey, like, exceptedKeys );
				like.hash = await Web3Digester.hashObject( like );
				expect( like.sig ).toBeDefined();
				expect( typeof like.sig ).toBe( 'string' );
				expect( like.sig.length ).toBeGreaterThanOrEqual( 0 );

				response = await request( app )
					.post( '/v1/like/add' )
					.send( {
						wallet : walletObj.address, data : like, sig : like.sig
					} );
				expect( response ).toBeDefined();
				expect( response ).toHaveProperty( 'statusCode' );
				expect( response ).toHaveProperty( '_body' );
				if ( 200 !== response.statusCode )
				{
					console.log( response );
				}
				expect( response.statusCode ).toBe( 200 );
				expect( response._body ).toBeDefined();
				expect( response._body.data ).toBeDefined();
				expect( response._body.data ).toHaveProperty( '_id' );
				expect( response._body.data ).toHaveProperty( 'hash' );
				expect( response._body.data ).toHaveProperty( 'wallet' );
				expect( response._body.data ).toHaveProperty( 'refType' );
				expect( response._body.data ).toHaveProperty( 'refHash' );
				expect( response._body.data.hash ).toBe( like.hash );
				expect( response._body.data.sig ).toBe( like.sig );

				//  ...
				await TestUtil.sleep( new Date().getTime() % 30 );
			}

			//	wait for a while
			await TestUtil.sleep( 3 * 1000 );

		}, 60 * 10e3 );
	} );
} );

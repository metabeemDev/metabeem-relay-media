import request from "supertest";
import { app, runHttpServer } from '../../src/http/http.js';
import { describe, expect } from "@jest/globals";
import { EtherWallet, Web3Digester, Web3Signer } from "web3id";
import { ethers } from "ethers";
import { SchemaUtil } from "chaintalk-store";
import { TestUtil } from "chaintalk-utils";

const server = runHttpServer();


describe( 'ContactController', () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
		//
		//	close http server
		//
		return new Promise(( resolve ) =>
		{
			server.close(() =>
			{
				//console.log( 'Http Server is closed' );
				resolve();	// Test has been completed
			});
		});
	} );

	test( 'it should response the GET method by path /', async () =>
	{
		const response = await request( app ).get( '/' );
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
	} );


	describe( "Add record", () =>
	{
		it( "it should response the POST method by path /v1/contact/add", async () =>
		{
			//
			//	create a wallet by mnemonic
			//
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const walletObj = EtherWallet.createWalletFromMnemonic( mnemonic );
			const walletNewContactObj = EtherWallet.createWalletFromMnemonic();

			//	assert ...
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			//
			//	create a new contact with ether signature
			//
			let contact = {
				timestamp : new Date().getTime(),
				hash : '',
				version : '1.0.0',
				deleted : SchemaUtil.createHexStringObjectIdFromTime( 0 ),
				wallet : walletObj.address,
				address : walletNewContactObj.address,
				sig : ``,
				name : `Sam`,
				avatar : 'https://avatars.githubusercontent.com/u/142800322?v=4',
				remark : 'no remark',
				createdAt: new Date(),
				updatedAt: new Date()
			};
			contact.sig = await Web3Signer.signObject( walletObj.privateKey, contact );
			contact.hash = await Web3Digester.hashObject( contact );
			expect( contact.sig ).toBeDefined();
			expect( typeof contact.sig ).toBe( 'string' );
			expect( contact.sig.length ).toBeGreaterThanOrEqual( 0 );

			const response = await request( app )
				.post( '/v1/contact/add' )
				.send({
					wallet : walletObj.address,
					data : contact,
					sig : contact.sig
				})
			;
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
			expect( response._body.data.hash ).toBe( contact.hash );

			//	wait for a while
			await TestUtil.sleep(5 * 1000 );

		}, 60 * 10e3 );
	} );
} );

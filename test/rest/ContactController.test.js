import request from "supertest";
import { app, runHttpServer } from '../../src/http/http.js';

const server = runHttpServer();


describe( 'Test the root path', () =>
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

	test( 'it should response the GET method', async () =>
	{
		const response = await request( app ).get( '/' );
		console.log( response );

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
} );

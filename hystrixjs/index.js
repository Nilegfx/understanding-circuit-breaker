import { default as Axios } from 'axios';
import { Observable } from 'rxjs';

const service = {
  port          : 3020,
  url           : 'https://localhost.com',
  errorThreshold: 3,
  timeout       : 2000,
  concurrency   : 10,
  sleep         : 20000
}

const makeRequest    = ( url ) => {
  console.log( url );
  return Axios.get( url )
};
const isErrorHandler = () => {
  console.error( 'isErrorHandler' );
  return new Error( 'error' )
};

const fallback = ( e, requestArgument ) => {
  console.log( 'fallback!' );
  console.log( 'fallback param1', e );
  failures.push( requestArgument );
  return Promise.reject( e );
}

const CommandsFactory = require( 'hystrixjs' ).commandFactory;
let serviceCommand    = CommandsFactory.getOrCreate( "Service on port :" + service.url + ":" + service.port )
  .circuitBreakerErrorThresholdPercentage( service.errorThreshold )
  .timeout( service.timeout )
  .run( makeRequest )
  .circuitBreakerRequestVolumeThreshold( service.concurrency )
  .circuitBreakerSleepWindowInMilliseconds( service.sleep )
  .statisticalWindowLength( 10000 )
  .statisticalWindowNumberOfBuckets( 10 )
  .errorHandler( isErrorHandler )
  .fallbackTo( fallback )
  .build();

Observable
  .interval( 1000 )
  .subscribe( ( i ) => {
    console.log( '---------------------------------------------' );
    serviceCommand
      .execute( `http://localhost:3020/${i}` )
      .then( ( response ) => {
        console.log( response );
      } )
      .catch( ( data ) => {
        // console.error( data );
        console.error( 'fallback should be here!' )
      } );
  } );



import { default as express } from 'express';


const failures = [];
const app      = express();

app.get( '/failures', ( req, res ) => {
  res.json( failures );
} );
app.get( '/:fail?', ( req, res ) => {

  if ( req.params.fail ) {
    console.error( 'a call to the service! with failure response' );
    return res.status( 404 ).send( { message: '404 broke!', failure: req.params.fail } );
  }
  ;
  console.info( 'a call to the service! with success response' );
  res.send( 'cool, works!' );
} );


app.listen( 3020, () => {
  console.log( "http://localhost:3020" )
} )

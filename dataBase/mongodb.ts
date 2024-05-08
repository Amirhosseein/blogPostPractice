
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';


let client:MongoClient;
let clientPromise: Promise<MongoClient>;



  client = new MongoClient(uri);

  clientPromise = client.connect();


export default clientPromise
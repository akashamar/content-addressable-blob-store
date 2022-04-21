import express from "express";
import blobs from 'content-addressable-blob-store';
import fs from 'fs'
import crypto from 'crypto'

const store = blobs('./data')
const port = 6000
const app = express();

// store.createReadStream("c8c126f12f2b116c87c24a238c0d7ca7d84d5d7a82c61a0ae1bf556351fef270").pipe(process.stdout)
// store.exists("c8c126f12f2b116c87c24a238c0d7ca7d84d5d7a82c61a0ae1bf556351fef270",((err, exist) => console.log(exist)))
// store.resolve("c8c126f12f2b116c87c24a238c0d7ca7d84d5d7a82c61a0ae1bf556351fef270", ((err, path, stat) => {
// 	console.log(err, path, stat)
// }))

const createChunks = () => {
	const file = fs.readFileSync('./text')
	 let startPointer = 0;
	 let endPointer = fs.statSync("./text").size;
	 let chunks = [];
	 while(startPointer<endPointer){
	  let newStartPointer = startPointer+3;
	  chunks.push(file.slice(startPointer,newStartPointer));
	  startPointer = newStartPointer;
	 }
	 return chunks;
}

const sumArr = []
function calculateHash(){
	const chunks = createChunks()
	console.log(chunks)
	const hashes = []
  chunks.forEach((data) => {
  	var sha1sum = crypto.createHash('sha1').update(data).digest("hex");
  	if (hashes.includes(sha1sum)){
  		console.log(data, "dont store")
  	} else {
  		console.log('store')
  	}
  	hashes.push(sha1sum)
  })
  console.log(hashes)
  return hashes
}

calculateHash()

app.get('/', (async(req, res) => {
	// console.log(store)
	// const w = store.createWriteStream()
 
	// w.write('hi')
	// w.write('how are you')

	// w.end(function () {
	// 	console.log('blob written: '+w.key)
	// 	console.log('blob written: '+w)
	// 	store.createReadStream(w.key).pipe(process.stdout)
	// })

	res.status(200).json({ message: "Hello" })
}))

app.listen(port, () => console.log(`server running at port ${port}`));
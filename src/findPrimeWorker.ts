import { parentPort,  } from "worker_threads";
import { findPrimes } from "./utils";



parentPort.on('message', (contents) => {

    const [lowerBound,upperBound] = contents
    const primes = findPrimes(lowerBound, upperBound)
    
    parentPort.postMessage(primes)
})


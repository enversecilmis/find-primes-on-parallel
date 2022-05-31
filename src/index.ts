import { cpus } from "os";
import { Worker } from "worker_threads";
import { findPrimes } from "./findPrime";








// ******************************   Single Thread   *******************************

// const DATE_BEFORE = Date.now()
// const primes = findPrimes(0,1000000)
// console.log(primes)
// console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);








// ******************************   Multi Thread   *******************************

const [ lowerBound, upperBound ] = [ 0, 1000000 ]
const threadCount = cpus().length*2 // idk

const calcRange = upperBound - lowerBound
const rangePerThread = Math.floor(calcRange / threadCount)
const leftover = calcRange % threadCount



const workerFoundPrimes: number[][] = new Array(threadCount)
const workers: Worker[] = []
let WORKING_WORKER_COUNT = threadCount



// Create workers
for (let i=0; i<threadCount; i++){

    const worker = new Worker('./dist/findPrimeWorker.js')

    worker.on('message', (res: number[]) => {
        workerFoundPrimes[i] = res

        console.log(`${i}.  ${worker.threadId}: Returned`);
        worker.terminate().then( val => {
            console.log(`${i}. Terminated ${val}`)
        })
        WORKING_WORKER_COUNT--
    })

    workers.push(worker)
}


const DATE_BEFORE = Date.now()
// Give ranges to workers to work with
for (let i=0; i<threadCount-1; i++){

    let lower = lowerBound + rangePerThread*i
    let upper = lower + rangePerThread
    
    workers[i].postMessage([lower, upper])
}

// Give leftover to last worker in addition to its range
let lower = lowerBound + rangePerThread*(threadCount-1)
let upper = lower + rangePerThread + leftover
workers[threadCount-1].postMessage([lower,upper])






const interval1 = setInterval(() => {
    if(WORKING_WORKER_COUNT === 0){
        console.log(workerFoundPrimes);
        console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);
        
        clearInterval(interval1)
    }
},300)









import { cpus } from "os";
import { Worker } from "worker_threads";
import { findPrimes, reduce2DArrayTo1D } from "./utils";







const LOWER_BOUND             =  0
const UPPER_BOUND             =  1000000
const THREAD_COUNT            =  cpus().length*2 // Arbitrary (I guess?)
const RANGE_LENGTH            =  UPPER_BOUND - LOWER_BOUND
const RANGE_LENGTH_PER_THREAD =  Math.floor(RANGE_LENGTH / THREAD_COUNT)
const LEFTOVER_SIZE           =  RANGE_LENGTH % THREAD_COUNT
const DATE_BEFORE = Date.now()


// Every worker puts its data to its corresponding index so we don't have to deal with sorting later.
const workerFoundPrimes: number[][] = new Array(THREAD_COUNT)
const workers: Worker[] = []
let workingWorkersCount = THREAD_COUNT





// Initialize workers and set listeners.
for (let i=0; i<THREAD_COUNT; i++){
    const worker = new Worker('./dist/findPrimeWorker.js')

    worker.on('message', (primes: number[]) => {
        workerFoundPrimes[i] = primes

        console.log(`${i}. worker ${worker.threadId}: Returned`);
        worker.terminate()
        workingWorkersCount--
    })
    workers.push(worker)
}





// Give equal ranges to workers to work with, except last worker.
for (let i=0; i<THREAD_COUNT-1; i++){

    let lower = LOWER_BOUND + RANGE_LENGTH_PER_THREAD*i
    let upper = lower + RANGE_LENGTH_PER_THREAD
    
    workers[i].postMessage([lower, upper])
}

// Give leftovers to last worker in addition to its own range.
let lower = LOWER_BOUND + RANGE_LENGTH_PER_THREAD * (THREAD_COUNT-1)
let upper = lower + RANGE_LENGTH_PER_THREAD + LEFTOVER_SIZE   
workers[THREAD_COUNT-1].postMessage([lower,upper])





// Don't know how else to wait for all workers to finish.
const interval = setInterval(() => {
    if(workingWorkersCount === 0){
        
        const primes = reduce2DArrayTo1D(workerFoundPrimes)
        console.log(primes)
        console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);
        
        clearInterval(interval)
    }
},300)










// ******************************   Single Thread   *******************************

// const DATE_BEFORE = Date.now()
// const primes = findPrimes(0,1000000)
// console.log(primes)
// console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);



import { cpus } from "os";
import { Worker } from "worker_threads";
import { findPrimes } from "./findPrime";








// ******************************   Single Thread   *******************************

// const DATE_BEFORE = Date.now()
// const primes = findPrimes(0,1000000)
// console.log(primes)
// console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);








// ******************************   Multi Thread   *******************************

const [ LOWER_BOUND, UPPER_BOUND ] = [ 0, 1000000 ]
const THREAD_COUNT = cpus().length*2 // idk

const CALC_RANGE = UPPER_BOUND - LOWER_BOUND
const RANGE_PER_THREAD = Math.floor(CALC_RANGE / THREAD_COUNT)
const LEFTOVER_SIZE = CALC_RANGE % THREAD_COUNT



const workerFoundPrimes: number[][] = new Array(THREAD_COUNT)
const workers: Worker[] = []
let working_worker_count = THREAD_COUNT



// Create workers
for (let i=0; i<THREAD_COUNT; i++){

    const worker = new Worker('./dist/findPrimeWorker.js')

    worker.on('message', (res: number[]) => {
        workerFoundPrimes[i] = res

        console.log(`${i}.  ${worker.threadId}: Returned`);
        worker.terminate().then( val => {
            console.log(`${i}. Terminated ${val}`)
        })
        working_worker_count--
    })

    workers.push(worker)
}


const DATE_BEFORE = Date.now()
// Give ranges to workers to work with
for (let i=0; i<THREAD_COUNT-1; i++){

    let lower = LOWER_BOUND + RANGE_PER_THREAD*i
    let upper = lower + RANGE_PER_THREAD
    
    workers[i].postMessage([lower, upper])
}

// Give leftovers to last worker in addition to its range
let lower = LOWER_BOUND + RANGE_PER_THREAD*(THREAD_COUNT-1)
let upper = lower + RANGE_PER_THREAD + LEFTOVER_SIZE   
workers[THREAD_COUNT-1].postMessage([lower,upper])






// Didn't know how else to wait for all workers to finish
const interval1 = setInterval(() => {
    if(working_worker_count === 0){
        console.log(workerFoundPrimes);
        console.log(`Run Time:  ${(Date.now() - DATE_BEFORE)/1000} seconds`);
        
        clearInterval(interval1)
    }
},300)









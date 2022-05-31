


const findPrimes = (min: number, max: number): number[] => {
    const primes: number[] = []

    for (let i=min; i<max; i++)
        if(isPrime(i)) primes.push(i)
    
    return primes
}



const isPrime = (x: number) => {
    if(x%2 === 0 || x === 1)
        return false

    for(let i=3; i<Math.floor(x/2); i += 2)
        if(x%i === 0) return false

    return true
}



export {
    findPrimes,
    isPrime,
}
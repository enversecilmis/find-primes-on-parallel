const reduce2DArrayTo1D = <T>(array: T[][]): T[] => (
    array.reduce((prev,current): T[] => prev.concat(current))
)




const findPrimes = (lower_bound: number, upper_bound: number): number[] => {
    const primes: number[] = []

    for (let i=lower_bound; i<upper_bound; i++)
        if(isPrime(i)) primes.push(i)
    
    return primes
}




const isPrime = (x: number): boolean => {
    if(x === 2) return true
    
    if(x%2 === 0 || x < 2) return false

        
    const n = Math.sqrt(x)
    for(let i=3; i<=n; i+=2)
        if(x%i === 0) return false

    return true
}




const sieveOfEratosthenes = (x: number): number[] => {

    if(x<2)
        return []
    
    const isPrimeArray: boolean[] = new Array(x)
    isPrimeArray.fill(true, 0, x)
    isPrimeArray[0] = false
    isPrimeArray[1] = false
    
    for (let i=2; i<Math.sqrt(x); i++){
        if (isPrimeArray[i])
            for(let j=i*i; j<x; j += i)
                isPrimeArray[j] = false
    }
    const primes: number[] = []

    isPrimeArray.forEach((val,idx) => {
        if(val)
            primes.push(idx)
    })

    return primes
}






export {
    isPrime,
    findPrimes,
    reduce2DArrayTo1D,
    sieveOfEratosthenes,
}
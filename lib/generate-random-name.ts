/**
 * Generate a username like "janesmith541" or "janesmith"
 * @param useNumbers include a random 3-digit suffix? default `true`
 */
function generateName(useNumbers = true): string {
    // Sample name lists — feel free to extend!
    const firstNames = [
        "Jane",
        "Alex",
        "Sam",
        "Taylor",
        "Jordan",
        "Casey",
        "Morgan",
        "Riley",
        "Quinn",
        "Drew",
    ]
    const lastNames = [
        "Smith",
        "Johnson",
        "Lee",
        "Brown",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Lopez",
    ]

    const first = firstNames[Math.floor(Math.random() * firstNames.length)]
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    const base = `${first}${last}`.toLowerCase()

    if (useNumbers) {
        // random number from 100–999
        const num = Math.floor(Math.random() * 900) + 100
        return `${base}${num}`
    }
    return base
}

/**
 * Generate a single random “word” username like "matrix" or "vortex"
 */
function generateRandomWord(): string {
    // A small random-word list
    const words = [
        "echo",
        "pixel",
        "matrix",
        "orbit",
        "zenith",
        "lumen",
        "nova",
        "quasar",
        "vortex",
        "solstice",
    ]

    return words[Math.floor(Math.random() * words.length)]
}

export default function generateRandomUsername(): string {
    return generateName() + "-" + generateRandomWord()
}

// clear params from url
export default function clearParams(key: string) {
    const params = new URLSearchParams(window.location.search)
    if (params.get(key) === null) return
    params.delete(key)

    // rebuild path + any remaining params
    const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "")

    // replace the current history entry (no reload, no new entry)
    window.history.replaceState(null, "", newUrl)
}

export default function orderingBuilder(query) {

    const [key, order] = query.split(",")

    if (!key || !order) return undefined

    return [key, order]
}
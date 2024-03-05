export function getSigles(str: string | string[]) {
    if (Array.isArray(str))
        return str.map(each => {
            const sp = each.split(" ")
            if (sp[1]) return sp[0][0] + ". " + sp[1]
            return each
        })

    const sp = str.split(" ")
    if (sp[1]) return sp[0][0] + ". " + sp[1]
    return str

}
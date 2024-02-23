import literalBuilder from "./literalBuilder.mjs"

export default function groupBuilder(text) {
    if (!text || text.trim() == '') return
    return text.split(",").map(each => literalBuilder(each))
}
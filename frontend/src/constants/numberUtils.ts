export function cashify(value: number) {
    let strValue = value.toFixed(2).toString()
    let [integerValue, commaValue] = strValue.split('.')
    let newValue = ''
    let index = 0
    
    newValue = integerValue.split('').reduceRight((acum, each) => {
        index++
        if (index > 3) {
            index = 1;
            return each + "." + acum
        }

        return each + acum


    }, '')
    return newValue + ',' + (commaValue ?? '00')
}
export function getOnlyNecessaryAttributes(table) {
    return Object.keys(table.getAttributes())
        .filter(
            (each) => !["id", "createdAt", "updatedAt"].includes(each)
        )
}

/**
 * LEMBRAR DE MELHORAR ISSO AQUI
 */
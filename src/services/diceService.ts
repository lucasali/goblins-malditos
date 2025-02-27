/**
 * Serviço para rolagem de dados
 */

/**
 * Rola um dado com o número especificado de faces
 * @param faces Número de faces do dado
 * @returns Resultado da rolagem (1 a faces)
 */
export function rollDie(faces: number): number {
  return Math.floor(Math.random() * faces) + 1
}

/**
 * Rola múltiplos dados
 * @param dice Array com o número de faces de cada dado
 * @returns Array com os resultados das rolagens
 */
export function rollDice(dice: number[]): number[] {
  return dice.map(faces => rollDie(faces))
}

/**
 * Calcula a soma dos resultados de uma rolagem
 * @param results Array com os resultados das rolagens
 * @returns Soma total dos resultados
 */
export function calculateTotal(results: number[]): number {
  return results.reduce((sum, result) => sum + result, 0)
}

/**
 * Tipos de dados comuns em RPGs
 */
export const commonDice = [4, 6, 8, 10, 12, 20, 100]

/**
 * Formata a notação de dados no estilo RPG (ex: 2d6, 1d20, etc)
 * @param count Quantidade de dados
 * @param faces Número de faces
 * @returns String formatada (ex: "2d6")
 */
export function formatDiceNotation(count: number, faces: number): string {
  return `${count}d${faces}`
}

/**
 * Analisa uma notação de dados e retorna a quantidade e faces
 * @param notation Notação de dados (ex: "2d6")
 * @returns Objeto com count (quantidade) e faces (número de faces)
 */
export function parseDiceNotation(notation: string): { count: number, faces: number } | null {
  const match = notation.toLowerCase().match(/^(\d+)d(\d+)$/)
  if (!match)
    return null

  return {
    count: Number.parseInt(match[1], 10),
    faces: Number.parseInt(match[2], 10),
  }
}

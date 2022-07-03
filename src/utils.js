
/**
 * Função auxiliar que implementa o método que decidi usar nesse caso para saber
 * se estamos em um ambiente mobile
 * 
 * @note Não recomendo esse método, fiz assim nessa situação,
 * pois é suficientemente acertivo nesse caso
 * 
 * @returns {boolean}
 */
export const isMobile = () => {
    return window.innerWidth < 800;
}

/**
 * Inicialmente não preciso ficar reconstruindo esse objeto, os parâmetros
 * não mudam dinamicamente nesse app
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * Função auxiliar que responde se um dado parâemtro foi passado através da
 * query string
 * 
 * @param {string} name nome do parâmetro sendo checado
 * @returns {boolean}
 */
export const hasParam = (name) => urlParams.has(name);

/**
 * Função que lê parâmetros da query string como booleanos
 * 
 * @param {string} name nome do parâmetro
 * @param {boolean} [defaulty] valor padrão para parâmetro não encontrado
 * ou valor incorreto provido, `false` é o valor padrão.
 * @returns {boolean}
 */
export const getBooleanParam = (name, defaulty = false) => {
    const value = urlParams.get(name);

    return (value === 'true')
        ? true
        : (value === 'false')
            ? false
            : defaulty;
}

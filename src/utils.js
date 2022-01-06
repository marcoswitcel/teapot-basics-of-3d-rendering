
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

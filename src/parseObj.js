
/**
 * @typedef {import('./Vec3.js').default} Vec3
 */

/**
 * Parseia um arquivo `.obj` a partir de um string
 * 
 * @param {string} text String contendo o valor do conteúdo lido do arquivo `.obj`
 * @returns {{ verts: Vec3[], faces: number[][] }}
 */
export default function parseObj(text) {
    const verts = [];
    const faces = [];

    // separa o texto em linhas
    const lines = text.replace('\r', '').split('\n');
    const numberOfLines = lines.length;

    for (let i = 0; i < numberOfLines; i++) {
        const line = lines[i];
        const tokens = line.split(' ');

        if (line[0] == 'v') {
            // linhas que começam com 'v' são vértices
            verts.push({
                x: parseFloat(tokens[1]),
                y: parseFloat(tokens[2]),
                z: parseFloat(tokens[3])
            });
        } else if (line[0] == 'f') {
            // linhas que começam com 'f' são faces
            const face = [
                parseInt(tokens[1], 10),
                parseInt(tokens[2], 10),
                parseInt(tokens[3], 10)
            ];
            faces.push(face);

            if (face[0] < 0) {
                face[0] = verts.length + face[0];
            }
            if (face[1] < 0) {
                face[1] = verts.length + face[1];
            }
            if (face[2] < 0) {
                face[2] = verts.length + face[2];
            }
        }
    }

    // retorna um objeto com as vértices e faces
    return {
        verts: verts,
        faces: faces
    };
}

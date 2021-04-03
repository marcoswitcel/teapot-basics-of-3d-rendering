//@ts-check

/**
 * parses an obj file from a text string
 * 
 * @param {String} text 
 * @returns {Object}
 */
export default function parseObj(text) {
    var verts = [];
    var faces = [];
    
    // split the text into lines
    var lines = text.replace('\r', '').split('\n');
    var count = lines.length;
    
    for (var i = 0; i < count; i++) {
      var line = lines[i];
      
      if (line[0] == 'v') {
        // lines that start with 'v' are vertices
        var tokens = line.split(' ');
        verts.push({
          x: parseFloat(tokens[1]), 
          y: parseFloat(tokens[2]), 
          z: parseFloat(tokens[3])
        });
      }
      else if (line[0] == 'f') {
        // lines that start with 'f' are faces
        var tokens = line.split(' ');
        var face = [
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
    
    // return an object containing our vertices and faces
    return {
        verts: verts,
        faces: faces
    };
}
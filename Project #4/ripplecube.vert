#version 330 compatibility

uniform float uK, uP;

out vec3 vNs;
out vec3 vEs;
out vec3 vMC;

const float PI = 3.141592653;
const float y1 = 1.0;

void main()
{    
    vMC = gl_Vertex.xyz;
    vec4 newVertex = gl_Vertex;

    // Calculate circular ripples
    float r = sqrt(newVertex.x * newVertex.x + newVertex.y * newVertex.y); // Distance from origin
    newVertex.z = uK * (y1 - newVertex.y) * sin(2.0 * PI * r / uP); // Circular ripple formula

    vec4 ECposition = gl_ModelViewMatrix * newVertex;

    // Calculate partial derivatives for bump mapping
    float dzdx = uK * (y1 - newVertex.y) * (2.0 * PI * newVertex.x / (uP * r)) * cos(2.0 * PI * r / uP);
    float dzdy = -uK * sin(2.0 * PI * r / uP);
    vec3 xtangent = vec3(1.0, 0.0, dzdx);
    vec3 ytangent = vec3(0.0, 1.0, dzdy);

    // Calculate new normal vector
    vec3 newNormal = normalize(cross(xtangent, ytangent));
    vNs = newNormal;
    vEs = ECposition.xyz - vec3(0.0, 0.0, 0.0); // Vector from the eye position to the point

    gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}

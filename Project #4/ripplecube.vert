#version 330 compatibility

uniform float uA;
uniform float uB;
uniform float uD;

out vec3 vNs;
out vec3 vEs;
out vec3 vMC;

const float PI = 3.141592653;
const float y1 = 1.0;

void main()
{    
    vMC = gl_Vertex.xyz;
    vec4 newVertex = gl_Vertex;

    // Calculate circular ripples with decay
    float r = length(newVertex.xy); // Distance from origin
    float decayFactor = exp(-uD * r); // Decay factor
    newVertex.z = uA * sin(2.0 * PI * r / uB) * decayFactor; // Circular ripple formula with decay

    vec4 ECposition = gl_ModelViewMatrix * newVertex;

    // Calculate partial derivatives for bump mapping
    float dzdx = uA * (2.0 * PI * newVertex.x / (uB * r)) * cos(2.0 * PI * r / uB) * decayFactor; // Modified dzdx with decay
    float dzdy = -uA * sin(2.0 * PI * r / uB) * decayFactor; // Modified dzdy with decay
    vec3 xtangent = vec3(1.0, 0.0, dzdx);
    vec3 ytangent = vec3(0.0, 1.0, dzdy);

    // Calculate new normal vector
    vec3 newNormal = normalize(cross(xtangent, ytangent));
    vNs = newNormal;
    vEs = ECposition.xyz - vec3(0.0, 0.0, 0.0); // Vector from the eye position to the point

    gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}

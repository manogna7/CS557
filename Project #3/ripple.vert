#version 330 compatibility

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

out vec2 vST;
out vec3 vMC;
out vec3 vec3Norm;
out vec3 vec3Light;
out vec3 vec3Eye;

vec4 LIGHTPOS = vec4(uLightX, uLightY, uLightZ, 1.);

#define PI 3.1415926535897932384626433832795

void main()
{
    vec4 P = gl_Vertex;
    float Y0 = 1.;

    float r = length(P.xy);  // Calculate the radius for circular pattern

    float dzdx = uA * (2. * PI / uB) * cos(2. * PI * r / uB + uC);
    float dzdy = -uA * sin(2. * PI * r / uB + uC);

    vec3 Tx = vec3(1., 0., dzdx);
    vec3 Ty = vec3(0., 1., dzdy);

     // Update P.z using circular pattern and decay rate
    P.z = uA * exp(-uD * r) * sin(2. * PI * r / uB + uC);


    vST = gl_MultiTexCoord0.st;

    // Getting the Normal
    vec4 mixLight = gl_ModelViewMatrix * LIGHTPOS;
    vec3 tnorm = normalize(gl_NormalMatrix * gl_Normal);
    vec3 ECposition = (gl_ModelViewMatrix * P).xyz;
    vec3Norm = normalize(gl_NormalMatrix * normalize(cross(Tx, Ty)));
    vec3Light = normalize(mixLight.xyz - ECposition);
    vec3Eye = normalize(vec3(0.0, 0.0, 0.0) - ECposition);
    gl_Position = gl_ModelViewProjectionMatrix * P;
    vMC = gl_Position.xyz;
}

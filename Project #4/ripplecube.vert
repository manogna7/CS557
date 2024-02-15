#version 330 compatibility

uniform float uK, uP;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;

const float PI = 3.141592653;
const float y1 = 1.;


void
main()
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	newVertex.z = uK * (y1-newVertex.y) * sin(2.*PI*newVertex.x/uP);

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdx = uK * (y1-newVertex.y) * (2.*PI/uP) * cos( 2.*PI*newVertex.x/uP );
	float dzdy = -uK * sin(2.*PI*newVertex.x/uP);
	vec3 xtangent = vec3( 1., 0., dzdx );
	vec3 ytangent = vec3( 0., 1., dzdy );

	vec3 newNormal = normalize(cross( xtangent, ytangent ));
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ); // vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;

	}
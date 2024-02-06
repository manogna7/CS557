#version 330 compatibility

uniform float uKa;
uniform float uKd;
uniform float uKs;

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;

uniform float uShininess;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uLightX; 
uniform float uLightY;
uniform float uLightZ;

uniform vec4 uColor;
uniform sampler3D Noise3;
uniform vec4 uSpecularColor;

in vec3 vMC;
in vec2 vST;
in vec3 vec3Eye;
in vec3 vec3Norm;
in vec3 vec3Light;

out 		vec3 vLight;
out 		vec3 vEye;
out 		vec3 vNormal;

void perFragLighting(vec4 glVertex) {
	vec4 vEyePos = gl_ModelViewMatrix * glVertex;
	vec3 vLightPos = vec3( uLightX, uLightY, uLightZ );

	vLight = vLightPos - vEyePos.xyz; // vector from eye to light pos
	vEye = vec3( 0., 0., 0. ) - vEyePos.xyz; // vector from the origin to eye
}


vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize(n);
}


void
main()
{
	//Bump-Mapping
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	vec3 tnorm = normalize(RotateNormal(angx,angy,vec3Norm));

    vec3 ambient = uKa * uColor.rgb;
    float d = max(dot(tnorm,vec3Light), 0.);
    vec3 diffuse = uKd * d * uColor.rgb;

    vec3 specular = uKs * 0.0 * uSpecularColor.rgb;
    if(dot(tnorm,vec3Light) > 0.){
        vec3 ref = normalize(2. * tnorm * dot(tnorm,vec3Light) - vec3Light);
        float t = pow( max( dot(vec3Eye,ref),0. ), uShininess );
		specular = uKs * t * uSpecularColor.rgb;
    }
    gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
	
}
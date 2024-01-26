#version 330 compatibility

// Constants for lighting coefficients
const float uKa = 0.2; // ambient coefficient
const float uKd = 0.7; // diffuse coefficient
const float uKs = 0.5; // specular coefficient

const float uShininess = 100.0; // adjust as needed

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

const vec3 BgColor = vec3(0.0, 0.5, 0.8);  
const vec3 DotColor = vec3(0.0, 0.0, 0.0);  


// in variables from the vertex shader:
in vec2 vST;            // texture cords
in vec3 vN;             // normal vector
in vec3 vL;             // vector from point to light
in vec3 vE;             // vector from point to eye
in vec3 vMCposition;

void main() {
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 myColor = vec3(1, 1, 1);           // Default color
    vec3 mySpecularColor = vec3(1, 1, 1);   // Specular color
    
    // Ellipse equation and color blending:
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    int numins = int(vST.s / uAd);
    int numint = int(vST.t / uBd);
    float sc = float(numins) * uAd + Ar;
    float tc = float(numint) * uBd + Br;
    float ellipse_equation = pow(((vST.s - sc) / Ar), 2) + pow(((vST.t - tc) / Br), 2);

        float t = smoothstep( 1. - uTol, 1. + uTol, ellipse_equation );
        myColor = mix(DotColor, BgColor, t);
	    gl_FragColor = vec4(myColor, 1.);
    
    // The per-fragment lighting:
	vec3 ambient = uKa * myColor;
    float d = max(dot(Normal, Light), 0.0);
	float s = 0.;
	if( dot(Normal, Light) > 0. )                            // only do specular if the light can see the point
	{
		d = dot(Normal, Light);
		vec3 ref = normalize(reflect(-Light, Normal));  // reflection vector
		s = pow(max(dot(Eye, ref),0. ), uShininess);
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}


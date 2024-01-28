#version 330 compatibility

const float uShininess = 100.0; // adjust as needed

uniform float uAd;
uniform float uBd ;
uniform float uTol;
uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseAmp;
uniform bool uUseXYZforNoise;

const float uKa = 0.2; // ambient coefficient
const float uKd = 0.7; // diffuse coefficient
const float uKs = 0.5; // specular coefficient

in vec2 vST;
in vec3 vN;             // normal vector
in vec3 vL;             // vector from point to light
in vec3 vE; 
in vec3 vMCposition;

void
main() {

	vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
	vec3 mySpecularColor = vec3(1, 1, 1);

	vec3 c0 = vec3(0.0, 0.5, 0.5);
	vec3 c1 = vec3(0,0,0);

	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	vec4 nv; 
	if(uUseXYZforNoise){
		nv = texture(Noise3, uNoiseFreq*vMCposition);
	}else{
		nv = texture(Noise3, uNoiseFreq*vec3(vST,0.));
	}

	// give the noise a range of [-1.,+1.]:

	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;

	// determine the color based on the noise-modified (s,t):

	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale; 		// scale by noise factor
	ds /= Ar; 			// ellipse equation
	dt *= scale; 		// scale by noise factor
	dt /= Br; 			// ellipse equation
	float ellipse_equation = ds*ds + dt*dt;

	vec3 color = mix(c0, c1, smoothstep(1 - uTol, 1 + uTol, ellipse_equation));
	gl_FragColor = vec4(color, 1.);

	// The per-fragment lighting:
	vec3 ambient = uKa * color;
    float d = max(dot(Normal, Light), 0.0);
	float s = 0.;
	if( dot(Normal, Light) > 0. )                            // only do specular if the light can see the point
	{
		d = dot(Normal, Light);
		vec3 ref = normalize(reflect(-Light, Normal));  // reflection vector
		s = pow(max(dot(Eye, ref),0. ), uShininess);
	}
	vec3 diffuse =  uKd * d * color;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}
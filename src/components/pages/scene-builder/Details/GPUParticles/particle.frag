varying vec4 parVel;
varying vec2 vUv;
uniform sampler2D picture;
uniform float opacity;

void main() {

    vec4 rainbow = parVel;

// vec4 outputColor = vec4(
//         (rainbow.x + 0.6),
//         (rainbow.y * rainbow.x + 0.6),
//         (rainbow.y + 0.6),
//         0.25
//     );
// outputColor.xyz = clamp(outputColor.xyz, vec3(0.0), vec3(1.0));
    vec4 imgColor = texture2D(picture, vUv);

    vec4 outputColor = vec4(0.5, 0.5, 0.5, opacity) * imgColor;

    gl_FragColor = outputColor;
}


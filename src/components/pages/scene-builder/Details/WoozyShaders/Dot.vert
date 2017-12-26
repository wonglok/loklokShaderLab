uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;

uniform float time;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main() {
  vec3 funPos = position;
  // vec3 newNormal = normal;
  // newNormal.y += newNormal.y * sin(newNormal.y * 3.0 + time * 3.1415);
  // newNormal.x += newNormal.x * sin(newNormal.x * 3.0 + time * 3.1415);
  // newNormal.z += newNormal.z * sin(newNormal.z * 3.0 + time * 3.1415);
  // funPos += newNormal * 0.1;

  funPos.y += sin(funPos.y * 3.0 + time * 3.1415);

  vec4 mvPosition = modelViewMatrix * vec4( funPos, 1.0 );
  vec4 worldPosition = modelMatrix * vec4( funPos, 1.0 );

  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

  vec3 I = worldPosition.xyz - cameraPosition;

  vReflect = reflect( I, worldNormal );
  vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
  vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
  vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
  vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 2.5;
}
import { connectSize, GLSL, Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import React from 'react';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { properties } from './common';
import { slider } from './components/customiser/customiser';


const shaders = Shaders.create({
  blur1D: {
    frag: GLSL`
    
    precision highp float;
    varying vec2 uv;
    uniform sampler2D t;
    uniform vec2 resolution;
    uniform float radius; // BLUR SIZE
    uniform float quality;
    
    //const float MAX_ITERATIONS = 1000.0;
    const float Directions = 48.0; 
    const float Quality = 12.0; 
    const float Pi = 6.28318530718; // Pi*2
    
    void main() {
      vec2 Radius = radius/resolution.xy;
      
      vec2 uv2 = uv.xy /resolution.xy;
      
      vec4 color = vec4(0.0);
      color = texture2D(t, uv2);
          
      for( float d=0.0; d<Pi; d+=Pi/Directions)
      {
        for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
        {
          color += texture2D( t, uv+vec2(cos(d),sin(d))*Radius*i);
        }
      }
      color /= Quality * Directions - 15.0;
      gl_FragColor = color;
}` }
});


export const Blur1 =
  connectSize(({ children: t, radius, width, height, quality }) =>
    <Node
      shader={shaders.blur1D}
      uniforms={{ t, resolution: [ width, height ], radius, quality }}
    />);

export const BlurG =
  connectSize(({ radius, quality, children }) =>
    <Blur1 radius={radius} quality={quality}>
        {children}
    </Blur1>);


function Component() {
    return (
      <AwesomeFrame
        cssModule={AwsFrameStyles}
        title="Gaussian Blur"
      >
        <Surface width={800} height={500}>
          <BlurG radius={slider.radius} quality={slider.quality}>
            /images/series/bojack-0.png
          </BlurG>
        </Surface>
      </AwesomeFrame>
    );
}

const example = { Component };

const examples = { images: {example, properties} };

export default examples;
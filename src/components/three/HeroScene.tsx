"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aTarget;
attribute float aRandom;
varying vec3 vColor;
varying float vAlpha;
${noise}
void main(){
  vec3 p = mix(position, aTarget, uMorph);
  vec3 dir = normalize(p + 0.0001);
  float n = snoise(p * 0.85 + uTime * 0.22);
  p += dir * n * 0.22;
  // Scroll scatters the cloud outward
  p += dir * uScroll * (1.2 + aRandom * 2.4);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec2 away = world.xy - uMouse;
  float push = smoothstep(1.3, 0.0, length(away));
  world.xy += normalize(away + 0.0001) * push * 0.55;
  world.z += push * 0.4;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + aRandom * 0.9) * uPixelRatio * (1.0 / -mv.z);

  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 cyan = vec3(0.133, 0.827, 0.933);
  vec3 col = mix(violet, cyan, smoothstep(-1.8, 1.8, p.y + n * 0.8));
  col = mix(col, vec3(1.0), step(0.965, aRandom) * 0.8 + push * 0.35);
  vColor = col;
  vAlpha = (0.55 + 0.45 * aRandom) * (1.0 - uScroll * 0.65);
}`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

function buildGeometry(count: number) {
  const sphere = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const random = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  const knot = new THREE.TorusKnotGeometry(1.25, 0.42, 420, 36, 2, 3).getAttribute("position");

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = 2.05 + (Math.random() - 0.5) * 0.08;
    sphere.set([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius], i * 3);

    // Random point on the torus knot surface
    const k = Math.floor(Math.random() * knot.count);
    target.set(
      [knot.getX(k) + (Math.random() - 0.5) * 0.06, knot.getY(k) + (Math.random() - 0.5) * 0.06, knot.getZ(k) + (Math.random() - 0.5) * 0.06],
      i * 3,
    );
    random[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(sphere, 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));
  return geometry;
}

function createUniforms(pixelRatio: number) {
  return {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uSize: { value: 26 },
    uPixelRatio: { value: pixelRatio },
  };
}

function ParticleCore({ count, mouse }: { count: number; mouse: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, gl } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => buildGeometry(count), [count]);
  const uniforms = useMemo(() => createUniforms(Math.min(gl.getPixelRatio(), 1.75)), [gl]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const wide = viewport.width > 7;
  const smoothMouse = useRef(new THREE.Vector2());
  const targetMouse = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    if (!material.current) return;
    const t = state.clock.elapsedTime;
    const u = material.current.uniforms;
    u.uTime.value = t;
    // Slow, eased breathing between sphere and knot
    const phase = 0.5 - 0.5 * Math.cos(t * 0.22);
    u.uMorph.value = phase * phase * (3 - 2 * phase);
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    u.uScroll.value += (scroll - u.uScroll.value) * 0.08;

    const m = mouse.current;
    smoothMouse.current.lerp(targetMouse.current.set(m.x, m.y), 0.08);
    u.uMouse.value.set((smoothMouse.current.x * viewport.width) / 2, (smoothMouse.current.y * viewport.height) / 2);

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += (smoothMouse.current.y * 0.35 - group.current.rotation.x) * 0.05;
      group.current.rotation.z += (-smoothMouse.current.x * 0.15 - group.current.rotation.z) * 0.05;
      group.current.position.x = wide ? viewport.width * 0.2 : 0;
      group.current.position.y = wide ? 0 : 0.6;
      const s = wide ? 1 : 0.78;
      group.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function buildStarfield(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions.set([(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, -Math.random() * 10 - 1], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => buildStarfield(count), [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.01;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.018} color="#b9b4ff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene() {
  const container = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [count] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 3800 : 8000));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (container.current) io.observe(container.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={container} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Starfield count={count < 5000 ? 500 : 1100} />
        <ParticleCore count={count} mouse={mouse} />
      </Canvas>
    </div>
  );
}

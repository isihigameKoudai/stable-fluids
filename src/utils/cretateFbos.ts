import * as THREE from "three";

type NullableFbos = {
  vel_0: THREE.WebGLRenderTarget | null;
  vel_1: THREE.WebGLRenderTarget | null;
  vel_viscous0: THREE.WebGLRenderTarget | null;
  vel_viscous1: THREE.WebGLRenderTarget | null;
  div: THREE.WebGLRenderTarget | null;
  pressure_0: THREE.WebGLRenderTarget | null;
  pressure_1: THREE.WebGLRenderTarget | null;
};

export type Fbos = {
  vel_0: THREE.WebGLRenderTarget;
  vel_1: THREE.WebGLRenderTarget;
  vel_viscous0: THREE.WebGLRenderTarget;
  vel_viscous1: THREE.WebGLRenderTarget;
  div: THREE.WebGLRenderTarget;
  pressure_0: THREE.WebGLRenderTarget;
  pressure_1: THREE.WebGLRenderTarget;
};

export const createFbos = (fboSize: THREE.Vector2): Fbos => {
  const initialFbos: NullableFbos = {
    vel_0: null,
    vel_1: null,
    vel_viscous0: null,
    vel_viscous1: null,
    div: null,
    pressure_0: null,
    pressure_1: null,
  };

  const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
    ? THREE.HalfFloatType
    : THREE.FloatType;
  (Object.keys(initialFbos) as (keyof Fbos)[]).forEach((key) => {
    initialFbos[key] = new THREE.WebGLRenderTarget(fboSize.x, fboSize.y, {
      type: type,
    });
  });
  const exportedFbos = initialFbos as Fbos;

  return exportedFbos;
};

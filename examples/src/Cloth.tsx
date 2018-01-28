import * as React from "react";
import {
  Color,
  DirectionalLight,
  DoubleSide,
  Fog,
  MeshDepthMaterial,
  ParametricGeometry, RepeatWrapping, RGBADepthPacking,
  TextureLoader,
  Vector3,
} from "three";

function clothFunction(u: number, v: number): Vector3 {
  return new Vector3(u, v);
}

const cloth = {
  h: 1,
  w: 1,
};

/* testing cloth simulation */

const pinsFormation: number[][] = [];

pinsFormation.push([6]);

pinsFormation.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

pinsFormation.push([0]);

pinsFormation.push([]);

pinsFormation.push([0, cloth.w]);

let pins = pinsFormation[1];

function togglePins() {
  pins = pinsFormation[Math.round(Math.random() * pinsFormation.length)];
}

const loader = new TextureLoader();

// TODO add this file
const clothTexture = loader.load("textures/patterns/circuit_pattern.png");
clothTexture.anisotropy = 16;

// TODO add this file
const groundTexture = loader.load("textures/terrain/grasslight-big.jpg");
groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
groundTexture.repeat.set(25, 25);
groundTexture.anisotropy = 16;

// TODO find ballSize
const ballSize = 5;

class ClothExample extends React.Component<never, never> {
  public render() {
    return <render
      camera={<perspectiveCamera
        fov={30}
        aspect={window.innerWidth / window.innerHeight}
        near={1}
        far={10000}

        position={new Vector3(1000, 50, 1500)}
      />}
      scene={<scene
        background={new Color(0xCCE0FF)}
        fog={new Fog(0XCCE0FF, 500, 10000)}
      >
        <resources>
          <resource
            source={<boxBufferGeometry
              width={5}
              height={375}
              depth={5}
            />}
            name="poleGeo"
          />
          <resource
            source={<meshLambertMaterial/>}
            name="poleMat"
          />
        </resources>
        <ambientLight
          color={0x666666}
        />
        <directionalLight
          castShadow

          position={new Vector3(50, 200, 100)
            .multiplyScalar(1.3)}
          ref={(directionalLight: DirectionalLight | null) => {
            if (directionalLight == null) {
              return;
            }
            // TODO move to a singleton

            const shadow = directionalLight.shadow;

            shadow.mapSize.width = 1024;
            shadow.mapSize.height = 1024;

            const shadowCamera = shadow.camera;

            const d = 300;

            shadowCamera.left = -d;
            shadowCamera.right = d;
            shadowCamera.top = d;
            shadowCamera.bottom = d;

            shadowCamera.far = 1000;
          }}
        />
        <mesh
          geometry={/* TODO make into react component */ new ParametricGeometry(clothFunction, cloth.w, cloth.h)}
          material={<meshLambertMaterial
            map={clothTexture}
            side={DoubleSide}
            alphaTest={0.5}
          />}

          position={new Vector3(0, 0, 0)}
          castShadow

          customDepthMaterial={new MeshDepthMaterial(
            {
              alphaTest: 0.5,
              depthPacking: RGBADepthPacking,

              map: clothTexture,
            } as any /* TODO fix depthPacking prop in three tsd as it's not there*/)}
        />
        <mesh
          geometry={<sphereBufferGeometry
            radius={ballSize}

            widthSegments={32}
            heightSegments={16}
          />}
          material={<meshLambertMaterial/>}

          castShadow
          receiveShadow
        />
        <mesh
          geometry={<planeBufferGeometry
            width={20000}
            height={20000}
          />}
          material={<meshLambertMaterial
            map={groundTexture}
          />}

          position={new Vector3(-Math.PI / 2, -250, 0)}

          receiveShadow
        />
        <mesh
          geometry={<geometryResource
            name="poleGeo"
          />}
          material={<materialResource
            name="poleMat"
          />}

          position={new Vector3(-125, 62)}

          receiveShadow
          castShadow
        />
        <mesh
          geometry={<geometryResource
            name="poleGeo"
          />}
          material={<materialResource
            name="poleMat"
          />}

          position={new Vector3(125, -62)}

          receiveShadow
          castShadow
        />
      </scene>}/>;
  }
}

import * as THREE from 'three'
THREE.Cache.enabled = true;
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, Environment } from '@react-three/drei'
// import * as zarr from 'zarrita'
import { variables, GetArray } from '@/components/ZarrLoaderLRU'
import { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react';
import { Leva, useControls } from 'leva'
import { lightTheme } from '@/utils/levaTheme'
import { ArrayToTexture } from './TextureMakers';
import { DataCube } from './PlotObjects';
import { Perf } from 'r3f-perf';

const storeURL = "https://s3.bgc-jena.mpg.de:9000/esdl-esdc-v3.0.2/esdc-16d-2.5deg-46x72x1440-3.0.2.zarr"

export function CanvasGeometry() {
  const { variable } = useControls({ variable: { value: null, options: variables } })
  const [texture, setTexture] = useState<THREE.DataTexture | THREE.Data3DTexture | null>(null)

  useEffect(() => {
    if (variable) {
      //Need to add a check somewhere here to swap to 2D or 3D based on shape. Probably export two variables from GetArray
      GetArray(storeURL, variable).then((data) => {
        setTexture(ArrayToTexture(data))
      })
  }}, [variable])
  

  return (
    <>
    <div className='canvas'>
      <Canvas shadows camera={{ position: [-4.5, 3, 4.5], fov: 50 }}
      frameloop="demand"
      >
        <Perf position='bottom-left' />
        <DataCube volTexture={texture} />
        <Center top position={[-1, 0, 1]}>
          {/* <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="indianred" />
          </mesh> */}
        </Center>
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <Environment preset="city" />
      </Canvas>
    </div>
    {/* This drop down is temp just to show the consolidating of variables */}
    
    <Leva theme={lightTheme} />
    </>
  )
}

export default CanvasGeometry
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import { Canvas, useLoader, useFrame, useUpdate } from 'react-three-fiber'
import img from './bit-2.png'
import './styles.css'

const randomBetween = (min, max) => min + Math.random() * (max - min)
const randomIntBetween = (min, max) => Math.floor(randomBetween(min, max))

const Tree = ({ position, size, height }) => {
  const MAX_SECTIONS_PER_TREE = 50
  const MIN_SECTIONS_PER_TREE = 4
  const MIN_SECTION_SCALE = 0.75
  const MAX_SECTION_SCALE = 3

  const sectionCount = randomIntBetween(MIN_SECTIONS_PER_TREE, MAX_SECTIONS_PER_TREE)
  const sections = []

  for (let i = 0; i < sectionCount; i++) {
    const hSize = size / 2
    const x = randomBetween(-hSize, hSize)
    const y = randomBetween(-hSize, hSize)
    const z = randomBetween(0, height)

    const scale = randomBetween(MIN_SECTION_SCALE, MAX_SECTION_SCALE)
    const rot = 3
    const rotX = randomBetween(THREE.MathUtils.degToRad(-rot), THREE.MathUtils.degToRad(rot))
    const rotY = randomBetween(THREE.MathUtils.degToRad(-rot), THREE.MathUtils.degToRad(rot))
    const rotZ = randomBetween(THREE.MathUtils.degToRad(-180), THREE.MathUtils.degToRad(180))

    // console.log(i, x, y, z)
    sections.push(<TreeBit key={i} position={[x, y, z]} scale={scale} rotation={[rotX, rotY, rotZ]} />)
  }

  return <group position={position}>{sections}</group>
}

const Dolly = () => {
  useFrame((state) => {
    state.camera.position.x = 0 + Math.sin(state.clock.getElapsedTime()) * 2
    state.camera.position.y = 0 + Math.cos(state.clock.getElapsedTime()) * 2
    state.camera.updateProjectionMatrix()
  })
  return null
}

const TreeBit = ({ position, scale, rotation }) => {
  const texture = useLoader(THREE.TextureLoader, img)
  return (
    <mesh position={position} scale={[scale, scale, scale]} rotation={rotation}>
      <planeBufferGeometry receiveShadow attach="geometry" args={[1, 1]} />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} transparent />
    </mesh>
  )
}

ReactDOM.render(
  <Canvas
    shadowMap
    colorManagement
    camera={{ position: [0, 0, 15] }}
    // color={'#CC0000'}
    // camera={{ rotation: [THREE.MathUtils.degToRad(90), 0, 0], position: [0, 10, 0], fov: 65, near: 2, far: 60 }}
    // gl={{ alpha: false }}
  >
    <Dolly />
    <directionalLight intensity={0.5} castShadow shadow-mapSize-height={512} shadow-mapSize-width={512} />
    <Suspense fallback={null}>
      {/* <ambientLight intensity={0.5} /> */}
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} castShadow />
      <Tree position={[0, 0, 0]} size={4} height={5} />
      <mesh>
        <planeBufferGeometry receiveShadow attach="geometry" args={[60, 55, 2]} />
        <meshBasicMaterial color={'#FFCC77'} attach="material" />
      </mesh>
    </Suspense>
  </Canvas>,
  document.getElementById('root')
)

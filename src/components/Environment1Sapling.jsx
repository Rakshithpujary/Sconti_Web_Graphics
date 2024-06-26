import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, Plane } from '@react-three/drei';
import Model from './Model';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { createRandomPositions, createLinearPositions } from './utils/createValues';
import { v4 as uuidv4 } from 'uuid';

function Environment1Sapling({ count }) {
  const texture = useLoader(TextureLoader, '/textures/ground1.jpg');
  const [trees, setTrees] = useState([]);
  const [treePositions, setTreePositions] = useState([]);
  const [grass, setGrass] = useState([]);
  const [score, setScore] = useState(-1);
  const [scoreChanged, setScoreChanged] = useState(false);

  function handleScore(val) {
    setScore(Number(val));
    setScoreChanged(prev => !prev); // Toggle the scoreChanged flag, to call useEffect
  }

  useEffect(() => {
    const grassPositions = createRandomPositions(4.2, 97);
    const grassElements = grassPositions.map(pos => <Model key={uuidv4()} position={pos} path={'/grass/anime_grass_2.glb'} />);
    setGrass(grassElements);
  }, []);

  useEffect(() => {
      const positions = createLinearPositions(4.8, count);
      setTreePositions(positions);
  }, [count]);

  useEffect(() => {
    if (treePositions.length !== 0) {
      const treeElements = treePositions.map(pos => <Model key={uuidv4()} position={pos} scale = {[0.17, 0.25, 0.17]} path={'/trees/coconut_tree.glb'}/>);
      setTrees(treeElements);
    }
  }, [treePositions]);

  useEffect(() => {
    if (score !== -1) {
      let position;
      if (score > 7) {
        position = createLinearPositions(4.8, 1, treePositions, true);
        if(position === null)
          console.log("No more positions left");
        else
          setTrees(prevTrees => [...prevTrees, <Model key={uuidv4()} position={position} scale = {[0.17, 0.25, 0.17]} path={'/trees/coconut_tree.glb'} />]);
      } else {
        position = createLinearPositions(4.8, 1, treePositions, true);
        if(position === null)
          console.log("No more positions left");
        else
          setTrees(prevTrees => [...prevTrees, <Model key={uuidv4()} position={position} scale = {[0.0017, 0.0023, 0.0017]} path={'/trees/treesapling.glb'} />]);
      }
    }
  }, [score, scoreChanged]);

  return (
    <>
      <input
        type='number'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleScore(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <Canvas>
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Environment preset='sunset' />
        <Suspense fallback={null}>
          <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <meshStandardMaterial map={texture} color='#bf7830' />
          </Plane>
          {grass}
          {trees}
        </Suspense>
      </Canvas>
    </>
  );
}

export default Environment1Sapling;
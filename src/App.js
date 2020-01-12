import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Tile } from './components/Tile';
import tiles from './tiles.json';

const WIDTH = 800,
  HEIGHT = 640,
  BLOCK_SIZE = 20,
  DEFAULT_TILE = { name: 'DEFAULT', color: '#000000' };

const emptyMap = v => {
  const map = [];
  for (let x = 0; x < WIDTH; x++) {
    map[x] = [];
    for (let y = 0; y < HEIGHT; y++) {
      map[x][y] = v;
    }
  }
  return map;
};

const _prevMap = emptyMap({ name: null, color: null });

const setValue = (map, x, y, v) => {
  const startX = Math.max(0, x - (x % BLOCK_SIZE));
  const startY = Math.max(0, y - (y % BLOCK_SIZE));

  const newValue = _prevMap[startX][startY].name !== v.name ? v : DEFAULT_TILE;
  for (let i = 0; i < BLOCK_SIZE; i++) {
    for (let j = 0; j < BLOCK_SIZE; j++) {
      map[startX + i][startY + j] = newValue;
    }
  }
  return map;
};

const render = (map, canvas) => {
  const ctx = canvas.current.getContext('2d');
  for (let x = 0; x + BLOCK_SIZE < WIDTH; x += BLOCK_SIZE) {
    for (let y = 0; y + BLOCK_SIZE < HEIGHT; y += BLOCK_SIZE) {
      const prevV = _prevMap[x][y];
      const v = map[x][y];
      if (v.name !== prevV.name) {
        _prevMap[x][y] = v;
        const color = v.color;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
};

const App = () => {
  const canvas = useRef();
  const tilesEl = useRef();
  const [map, setMap] = useState(emptyMap(DEFAULT_TILE));
  const [tick, setTick] = useState(0);
  const [tile, setTile] = useState(tiles[0]);

  const handleRender = () => {
    if (canvas.current) {
      render(map, canvas);
    }
  };

  const getPos = e => {
    const offsetX = tilesEl.current.offsetWidth;
    const offsetY = 0;
    const x = Math.min(e.clientX - offsetX, WIDTH);
    const y = Math.min(e.clientY - offsetY, HEIGHT);
    return {
      x,
      y,
    };
  };

  const handleClick = e => {
    const { x, y } = getPos(e);
    const newMap = setValue(map, x, y, tile);
    setMap(newMap);
    setTick(tick + 1);
  };

  useEffect(handleRender, [tick]);

  const selectTile = selectTileName =>
    setTile(tiles.find(({ name }) => name === selectTileName));

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div ref={tilesEl} style={{ display: 'flex', flexDirection: 'column' }}>
        {tiles.map(({ name, color }) => (
          <Tile
            key={name}
            name={name}
            color={color}
            selected={tile.name === name}
            onSelectTile={() => selectTile(name)}
          />
        ))}
      </div>
      <canvas
        onClick={handleClick}
        ref={canvas}
        width={WIDTH}
        height={HEIGHT}
      ></canvas>
    </div>
  );
};

export default App;

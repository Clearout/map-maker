import React from 'react';

export const Tile = ({ name, color, selected, onSelectTile }) => (
  <div
    style={{
      width: '50px',
      height: '50px',
      background: color,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: selected ? '2px solid black' : '2px solid white',
    }}
    onClick={onSelectTile}
  >
    <span style={{ filter: 'invert(100%' }}>{name}</span>{' '}
  </div>
);

import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('Hello, JSX Preview!');

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>{text}</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        style={{ padding: '10px', fontSize: '16px', marginTop: '20px' }}
      />
    </div>
  );
}

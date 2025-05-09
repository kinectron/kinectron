import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/kinectron.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/kinectron.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/kinectron.umd.js',
        format: 'umd',
        name: 'Kinectron',
        sourcemap: true,
        globals: {
          peerjs: 'Peer',
        },
      },
    ],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      terser({
        output: {
          comments: false,
        },
      }),
    ],
    external: ['peerjs'],
  },
];

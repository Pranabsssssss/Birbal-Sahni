/**
 * Convert STL to GLB using three.js in Node.
 * Reads the binary STL, applies a metallic material, and exports as compressed GLB.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// We'll use three + three-stdlib for this
const THREE = await import('three');
const { STLLoader } = await import('three-stdlib');
const { GLTFExporter } = await import('three-stdlib');

// Read the STL file
const stlPath = join(projectRoot, 'full scale assembly.STL');
const stlBuffer = readFileSync(stlPath);

// Parse the STL
const loader = new STLLoader();
const geometry = loader.parse(stlBuffer.buffer);

// Compute normals for better rendering
geometry.computeVertexNormals();

// Create a mesh with material
const material = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  metalness: 0.92,
  roughness: 0.18,
});

const mesh = new THREE.Mesh(geometry, material);

// Center the geometry
geometry.computeBoundingBox();
const center = new THREE.Vector3();
geometry.boundingBox.getCenter(center);
geometry.translate(-center.x, -center.y, -center.z);

// Normalize size - scale to fit within a reasonable unit cube
const size = new THREE.Vector3();
geometry.boundingBox.getSize(size);
const maxDim = Math.max(size.x, size.y, size.z);
const scale = 4.0 / maxDim; // Scale to ~4 units
mesh.scale.set(scale, scale, scale);

// Create a scene
const scene = new THREE.Scene();
scene.add(mesh);

// Export to GLB
const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) => {
  exporter.parse(
    scene,
    (result) => resolve(result),
    (error) => reject(error),
    { binary: true }
  );
});

const outPath = join(projectRoot, 'public', 'slave-arm.glb');
writeFileSync(outPath, Buffer.from(glb));

const originalSize = stlBuffer.length;
const glbSize = Buffer.from(glb).length;
console.log(`✅ Conversion complete!`);
console.log(`   STL: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   GLB: ${(glbSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Reduction: ${(((originalSize - glbSize) / originalSize) * 100).toFixed(1)}%`);
console.log(`   Output: ${outPath}`);

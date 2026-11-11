import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  routePoint,
  totalDistance,
  bendDistance,
  uwbAvailability,
} from "./scenario.mjs";
import { eigenSymmetric } from "./covariance.mjs";
const CYAN = 0x64d5c6,
  AMBER = 0xd6b181;
const v3 = (p) => new THREE.Vector3(p[0], p[2], -p[1]);
function line(points, color, opacity = 1, dashed = false) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(v3));
  const material = dashed
    ? new THREE.LineDashedMaterial({
        color,
        transparent: true,
        opacity,
        dashSize: 3,
        gapSize: 2,
      })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const l = new THREE.Line(geometry, material);
  if (dashed) l.computeLineDistances();
  return l;
}
function dispose(group) {
  group.traverse((o) => {
    o.geometry?.dispose();
    if (o.material)
      for (const m of [o.material].flat()) {
        m.map?.dispose();
        m.dispose();
      }
  });
  group.clear();
}
function label(text, color = "#9cafbd") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 80;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(10,18,26,.8)";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = color;
  ctx.font = "36px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, 256, 50);
  const map = new THREE.CanvasTexture(c),
    sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map, depthTest: false, transparent: true }),
    );
  sprite.scale.set(68, 10.6, 1);
  return sprite;
}
export class RouteViewport {
  constructor(element, onSelect) {
    this.element = element;
    this.mode = "global";
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#121b25");
    this.scene.fog = new THREE.Fog("#121b25", 650, 1400);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor("#121b25");
    element.append(this.renderer.domElement);
    this.renderer.domElement.setAttribute(
      "aria-label",
      "3D synthetic ravine route",
    );
    this.camera = new THREE.PerspectiveCamera(39, 1, 0.1, 10000);
    this.camera.position.set(480, 390, 460);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(230, 10, -55);
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 5000;
    this.controls.addEventListener("change", () => this.render());
    this.scene.add(new THREE.HemisphereLight(0xb3cce3, 0x17232b, 2));
    const sun = new THREE.DirectionalLight(0xffe4c0, 3);
    sun.position.set(-200, 500, 180);
    this.scene.add(sun);
    this.terrain = new THREE.Group();
    this.dynamic = new THREE.Group();
    this.scene.add(this.terrain, this.dynamic);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(element);
    this.resize();
    let down;
    element.addEventListener("pointerdown", (e) => {
      if (e.target === this.renderer.domElement) down = [e.clientX, e.clientY];
    });
    element.addEventListener("pointerup", (e) => {
      if (
        !down ||
        Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 ||
        !this.s
      )
        return;
      down = null;
      const r = this.renderer.domElement.getBoundingClientRect();
      let best = Infinity,
        distance = 0;
      for (let d = 0; d <= totalDistance(this.s); d++) {
        const p = v3(routePoint(this.s, d));
        p.y += 2;
        p.project(this.camera);
        if (p.z > 1) continue;
        const gap = Math.hypot(
          ((p.x + 1) * r.width) / 2 + r.left - e.clientX,
          ((-p.y + 1) * r.height) / 2 + r.top - e.clientY,
        );
        if (gap < best) {
          best = gap;
          distance = d;
        }
      }
      if (best < 25) onSelect(distance);
    });
  }
  resize() {
    const w = this.element.clientWidth,
      h = this.element.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.p) this.frameCamera();
    else this.render();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  setMode(mode) {
    this.mode = mode;
    this.frameCamera();
  }
  frameCamera() {
    if (!this.p) return;
    if (this.mode === "local") {
      const t = v3(this.p.position);
      this.controls.target.copy(t);
      this.camera.position
        .copy(t)
        .add(
          new THREE.Vector3(57, 45, 63).multiplyScalar(
            Math.max(1, 1 / this.camera.aspect),
          ),
        );
    } else {
      const bounds = new THREE.Box3()
        .setFromPoints(
          [0, 150, bendDistance(this.s), totalDistance(this.s)].map((d) =>
            v3(routePoint(this.s, d)),
          ),
        )
        .expandByScalar(18);
      const target = bounds.getCenter(new THREE.Vector3());
      const direction = new THREE.Vector3(290, 330, 440).normalize();
      const right = new THREE.Vector3()
        .crossVectors(this.camera.up, direction)
        .normalize();
      const up = new THREE.Vector3().crossVectors(direction, right).normalize();
      const tanVertical = Math.tan(
        THREE.MathUtils.degToRad(this.camera.fov / 2),
      );
      const tanHorizontal = tanVertical * this.camera.aspect;
      let distance = 80;
      // Fit the route to both viewport dimensions, including portrait screens.
      for (const x of [bounds.min.x, bounds.max.x])
        for (const y of [bounds.min.y, bounds.max.y])
          for (const z of [bounds.min.z, bounds.max.z]) {
            const corner = new THREE.Vector3(x, y, z).sub(target);
            distance = Math.max(
              distance,
              corner.dot(direction) +
                Math.abs(corner.dot(right)) / tanHorizontal,
              corner.dot(direction) + Math.abs(corner.dot(up)) / tanVertical,
            );
          }
      this.controls.target.copy(target);
      this.camera.position
        .copy(target)
        .addScaledVector(direction, distance * 1.1);
    }
    this.controls.update();
    this.render();
  }
  rebuild(s) {
    dispose(this.terrain);
    this.s = s;
    const total = totalDistance(s),
      samples = Array.from({ length: 101 }, (_, i) =>
        routePoint(s, (total * i) / 100),
      );
    const maxE = Math.max(300, ...samples.map((p) => p[0])) + 100,
      maxN = Math.max(80, ...samples.map((p) => p[1])) + 110;
    const nx = 75,
      nz = 55,
      vertices = [],
      colors = [],
      indices = [];
    for (let j = 0; j <= nz; j++)
      for (let i = 0; i <= nx; i++) {
        const e = -90 + ((maxE + 90) * i) / nx,
          n = -150 + ((maxN + 150) * j) / nz;
        let nearest = Infinity,
          height = 0,
          along = 0;
        for (let k = 0; k < samples.length - 1; k++) {
          const a = samples[k],
            b = samples[k + 1],
            dx = b[0] - a[0],
            dy = b[1] - a[1],
            t = Math.max(
              0,
              Math.min(
                1,
                ((e - a[0]) * dx + (n - a[1]) * dy) / (dx * dx + dy * dy || 1),
              ),
            );
          const gap = Math.hypot(e - a[0] - t * dx, n - a[1] - t * dy);
          if (gap < nearest) {
            nearest = gap;
            height = a[2] + t * (b[2] - a[2]);
            along = (total * (k + t)) / 100;
          }
        }
        const wall =
          along > 151
            ? Math.min(36, Math.max(0, nearest - 9) * 0.7) *
              Math.min(1, (along - 150) / 35)
            : 0;
        const rough =
          nearest > 7
            ? (Math.sin(e * 0.091) * Math.cos(n * 0.13) +
                Math.sin(n * 0.057 + e * 0.11)) *
              0.6
            : 0;
        vertices.push(e, height + wall + rough - 0.6, -n);
        const shade =
          0.22 + wall / 240 + (Math.sin(e * 0.17 + n * 0.16) + 1) * 0.013;
        colors.push(shade * 0.92, shade * 0.99, shade * 1.05);
      }
    for (let j = 0; j < nz; j++)
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i,
          b = a + 1,
          c = a + nx + 1,
          d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const terrain = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    );
    this.terrain.add(terrain);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0x677e8b,
        transparent: true,
        opacity: 0.07,
      }),
    );
    this.terrain.add(wire);
    const groundGrid = new THREE.GridHelper(1600, 32, 0x3d5264, 0x2e4052);
    groundGrid.position.y = -1.5;
    groundGrid.material.transparent = true;
    groundGrid.material.opacity = 0.25;
    this.terrain.add(groundGrid);
    this.terrain.add(
      line(
        samples.map((p) => [p[0], p[1], p[2] + 0.6]),
        CYAN,
        0.95,
      ),
    );
    for (const [d, title] of [
      [0, "LANDER"],
      [150, "RAVINE ENTRY"],
      [bendDistance(s), "BEND"],
      [total, "END"],
    ]) {
      const pos = routePoint(s, d),
        l = label(title);
      l.position.copy(v3(pos)).add(new THREE.Vector3(0, 13, 0));
      this.terrain.add(l);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 2.7, 32),
        new THREE.MeshBasicMaterial({
          color: 0x89aaa9,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(v3(pos));
      ring.position.y += 1;
      this.terrain.add(ring);
    }
    // Illustrative lander dimensions, independent of the uncertainty model.
    const lander = new THREE.Group(),
      body = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.8, 3.2, 6),
        new THREE.MeshStandardMaterial({ color: 0xaca99c, roughness: 0.6 }),
      );
    body.position.y = 3;
    lander.add(body);
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2 + Math.PI / 4;
      lander.add(
        line(
          [
            [Math.cos(a) * 2, Math.sin(a) * 2, 3],
            [Math.cos(a) * 4.5, Math.sin(a) * 4.5, 0],
          ],
          0xb5b6ad,
        ),
      );
    }
    this.terrain.add(lander);
    for (let i = 0; i < 24; i++) {
      const d = 160 + (total - 160) * ((i * 0.618) % 1);
      if (d > total || d < 150) continue;
      const p = routePoint(s, d),
        offset = (i % 2 ? 1 : -1) * (10 + (i % 7)),
        rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.7 + (i % 4) * 0.25, 0),
          new THREE.MeshStandardMaterial({ color: 0x5b6266, roughness: 1 }),
        );
      rock.position.copy(v3([p[0], p[1] + offset, p[2] + 1]));
      rock.rotation.set(i, 0.3 * i, i * 0.2);
      this.terrain.add(rock);
    }
  }
  ellipsoid(p, cov, color, opacity = 1) {
    const { values, vectors } = eigenSymmetric(cov),
      m = new THREE.Matrix4();
    const cols = values.map((v, j) =>
      v3([vectors[0][j], vectors[1][j], vectors[2][j]]).multiplyScalar(
        Math.sqrt(Math.max(0, v)),
      ),
    );
    m.makeBasis(...cols);
    m.setPosition(v3(p));
    const e = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 24, 12)),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    );
    e.matrixAutoUpdate = false;
    e.matrix.copy(m);
    this.dynamic.add(e);
  }
  update(s, result, p, missionChanged = false) {
    const first = !this.s;
    this.p = p;
    if (missionChanged || first) this.rebuild(s);
    else this.s = s;
    dispose(this.dynamic);
    const local = this.mode === "local",
      pos = p.position;
    const localCov = p.localSigma.map((v, i) =>
      p.localSigma.map((_, j) => (i === j ? v * v : 0)),
    );
    if (local) this.ellipsoid(pos, localCov, CYAN, 0.85);
    else {
      this.ellipsoid(pos, p.baseline, AMBER, 0.65);
      if (s.uwbEnabled || s.mapEnabled)
        this.ellipsoid(pos, p.selected, CYAN, 0.85);
    }
    const rover = new THREE.Group();
    rover.position.copy(v3(pos));
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 1.2),
      new THREE.MeshStandardMaterial({
        color: CYAN,
        emissive: CYAN,
        emissiveIntensity: 0.25,
      }),
    );
    body.position.y = 1;
    rover.add(body);
    const marker = new THREE.Mesh(
      new THREE.ConeGeometry(2, 5, 4),
      new THREE.MeshBasicMaterial({ color: CYAN }),
    );
    marker.rotation.z = Math.PI;
    marker.position.y = 9;
    rover.add(marker);
    this.dynamic.add(rover);
    // Deterministic prior perturbations, not posterior samples or confidence paths.
    for (const sign of [-1, 1]) {
      const points = [];
      for (
        let d = 0;
        d <= totalDistance(s);
        d += Math.max(1, totalDistance(s) / 100)
      ) {
        const q = routePoint(s, d),
          yaw = local ? 0 : (sign * s.heading_deg * Math.PI) / 180,
          t = local ? 0 : sign * s.landerH_m;
        points.push([
          q[0] + t - q[1] * yaw + sign * s.motionH_m * Math.sqrt(d / 100),
          q[1] + t + q[0] * yaw,
          q[2] +
            (local ? 0 : sign * s.landerU_m) +
            sign * s.motionU_m * Math.sqrt(d / 100),
        ]);
      }
      this.dynamic.add(line(points, AMBER, 0.28, true));
      // Nearby rock registration shares the origin/yaw realization with the local scene.
      const yaw = local ? 0 : (sign * s.heading_deg * Math.PI) / 180,
        t = local ? 0 : sign * s.landerH_m;
      for (let i = 0; i < 3; i++) {
        const rockPos = [pos[0] + i * 5 - 5, pos[1] + 12, pos[2] + 1],
          rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(1, 0),
            new THREE.MeshBasicMaterial({
              color: AMBER,
              transparent: true,
              opacity: local ? 0.1 : 0.25,
              wireframe: true,
            }),
          );
        rock.position.copy(
          v3([
            rockPos[0] + t - rockPos[1] * yaw,
            rockPos[1] + t + rockPos[0] * yaw,
            rockPos[2] + (local ? 0 : sign * s.landerU_m),
          ]),
        );
        this.dynamic.add(rock);
      }
    }
    for (const event of result.events) {
      const color = event.applied
        ? event.kind === "uwb"
          ? CYAN
          : 0xa7baff
        : AMBER;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(event.kind === "map" ? 1.2 : 0.85, 8, 6),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: event.distance <= p.distance ? 1 : 0.3,
        }),
      );
      dot.position.copy(v3(event.position));
      dot.position.y += 1.5;
      this.dynamic.add(dot);
    }
    if (s.uwbEnabled) {
      const available = uwbAvailability(s, p.distance) === "Available";
      this.dynamic.add(
        line([[0, 0, 0], pos], available ? CYAN : AMBER, 0.55, !available),
      );
      const e = result.events.find(
        (e) => e.kind === "uwb" && Math.abs(e.distance - p.distance) < 1e-7,
      );
      if (e?.applied) {
        const shell = new THREE.LineSegments(
          new THREE.WireframeGeometry(
            new THREE.SphereGeometry(Math.hypot(...pos), 40, 16),
          ),
          new THREE.LineBasicMaterial({
            color: e.applied ? CYAN : AMBER,
            transparent: true,
            opacity: 0.045,
            depthWrite: false,
          }),
        );
        this.dynamic.add(shell);
      }
    }
    const origin = v3(local ? pos : [0, 0, 0]);
    for (const [axis, delta, color] of [
      ["E", [20, 0, 0], 0xcda77c],
      ["N", [0, 20, 0], 0x8caebb],
      ["U", [0, 0, 20], 0xabc699],
    ]) {
      const end = [
        origin.x + delta[0],
        -origin.z + delta[1],
        origin.y + delta[2],
      ];
      this.dynamic.add(
        line([[origin.x, -origin.z, origin.y], end], color, 0.8),
      );
      const l = label(axis);
      l.scale.set(4, 2, 1);
      l.position.copy(v3(end));
      this.dynamic.add(l);
    }
    if (first || missionChanged) this.frameCamera();
    else if (local) {
      const delta = v3(pos).sub(this.controls.target);
      this.controls.target.add(delta);
      this.camera.position.add(delta);
      this.controls.update();
    }
    this.render();
  }
}

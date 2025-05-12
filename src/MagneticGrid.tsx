import { useEffect, useRef } from "react";

const DEFAULT_GRID_SIZE = 50; // spacing between icons in px
const ICON = "+";
const DASH = "—";
const DEFAULT_ROW_RADIUS = 3;
const DEFAULT_COL_RADIUS = 5;
const DEFAULT_ICON_SCALE = 1.2;
const DEFAULT_FONT_BASE_SIZE = 24;
const DEFAULT_FONT_COLOR = "#8ce1ff";
const DEFAULT_BG_COLOR = "black";

export type MagneticGridProps = {
  gridSize?: number;
  rowRadius?: number;
  colRadius?: number;
  iconScale?: number;
  fontBaseSize?: number;
  fontColor?: string;
  bgColor?: string;
};

type Position = { x: number; y: number };
type MousePosition = Position;

function MagneticGrid({
  gridSize = DEFAULT_GRID_SIZE,
  rowRadius = DEFAULT_ROW_RADIUS,
  colRadius = DEFAULT_COL_RADIUS,
  iconScale = DEFAULT_ICON_SCALE,
  fontBaseSize = DEFAULT_FONT_BASE_SIZE,
  fontColor = DEFAULT_FONT_COLOR,
  bgColor = DEFAULT_BG_COLOR,
}: MagneticGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const positionsRef = useRef<Position[]>([]);
  const angleMap = useRef(new Map<string, number>());
  const lastMouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      const positions = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pos = {
            x: x * gridSize + gridSize / 2,
            y: y * gridSize + gridSize / 2,
          };
          positions.push(pos);
          angleMap.current.set(`${pos.x},${pos.y}`, 0);
        }
      }
      positionsRef.current = positions;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      const now = Date.now();
      const isMoving = now - lastMoveTime.current < 100;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      positionsRef.current.forEach((pos) => {
        const dx = mouseRef.current.x - pos.x;
        const dy = mouseRef.current.y - pos.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const key = `${pos.x},${pos.y}`;

        const radius = gridSize * Math.max(colRadius, rowRadius);
        const extendedRadius = gridSize * (Math.max(colRadius, rowRadius) + 1);

        let targetAngle = 0;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        let fontSize = `${fontBaseSize * iconScale}px monospace`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontSize;

        if (dist <= radius) {
          const innerRadius = radius - gridSize;

          if (dist <= innerRadius) {
            targetAngle = Math.atan2(dy, dx);
            ctx.rotate(angleMap.current.get(key) || 0);
            ctx.fillText(DASH, 0, 0);
          } else if (isMoving) {
            const direction = dx >= 0 ? 1 : -1;
            targetAngle = 1.57 * direction; // ~90 deg
            ctx.rotate(angleMap.current.get(key) || 0);
            ctx.fillText(ICON, 0, 0);
          } else {
            ctx.rotate(angleMap.current.get(key) || 0);
            ctx.fillText(ICON, 0, 0);
          }
        } else if (dist <= extendedRadius && isMoving) {
          const direction = dx >= 0 ? 1 : -1;
          targetAngle = 0.45 * direction; // ~25 deg
          ctx.rotate(angleMap.current.get(key) || 0);
          ctx.fillText(ICON, 0, 0);
        } else {
          ctx.rotate(angleMap.current.get(key) || 0);
          ctx.fillText(ICON, 0, 0);
        }

        ctx.restore();

        const currentAngle = angleMap.current.get(key) || 0;
        const smoothedAngle = lerp(currentAngle, targetAngle, 0.05);
        angleMap.current.set(key, smoothedAngle);
      });
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [
    gridSize,
    rowRadius,
    colRadius,
    iconScale,
    fontBaseSize,
    fontColor,
    bgColor,
  ]);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
  );
}

export default MagneticGrid;
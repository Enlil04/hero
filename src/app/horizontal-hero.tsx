"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

const SECTIONS = [1, 2, 3];

type CardContent = { label: string; value: string };

type CardConfig = {
  id: string;
  s1: CardContent & { x: number; y: number };
  s2: CardContent & { x: number; y: number };
  s3: CardContent & { x: number; y: number };
  delay: number;
};

const CARDS: CardConfig[] = [
  {
    id: "members",
    s1: { label: "Members", value: "2.4k active", x: 5, y: 34 },
    s2: { label: "Flexibility", value: "94% score", x: 44, y: 20 },
    s3: { label: "Power", value: "+18% gain", x: 18, y: 30 },
    delay: 0,
  },
  {
    id: "programs",
    s1: { label: "Programs", value: "18 plans", x: 12, y: 56 },
    s2: { label: "Balance", value: "Level 8", x: 50, y: 36 },
    s3: { label: "Deadlift", value: "140 kg", x: 82, y: 28 },
    delay: 0.5,
  },
  {
    id: "recovery",
    s1: { label: "Recovery", value: "92% score", x: 24, y: 65 },
    s2: { label: "Mindfulness", value: "Daily", x: 34, y: 50 },
    s3: { label: "PRs", value: "6 this month", x: 12, y: 50 },
    delay: 1,
  },
  {
    id: "streak",
    s1: { label: "Streak", value: "14 days", x: 95, y: 34 },
    s2: { label: "Posture", value: "A+", x: 52, y: 58 },
    s3: { label: "Form", value: "9.2 score", x: 88, y: 48 },
    delay: 0.3,
  },
  {
    id: "sessions",
    s1: { label: "Sessions", value: "6 / week", x: 88, y: 56 },
    s2: { label: "Core", value: "12 min", x: 38, y: 68 },
    s3: { label: "Volume", value: "12k lbs", x: 22, y: 70 },
    delay: 0.8,
  },
  {
    id: "calories",
    s1: { label: "Calories", value: "540 kcal", x: 76, y: 65 },
    s2: { label: "Breath", value: "4-7-8", x: 48, y: 74 },
    s3: { label: "Recovery", value: "24 hours", x: 78, y: 72 },
    delay: 1.3,
  },
];

const NAV = [
  { label: "Trainings", n: "01" },
  { label: "Gallery", n: "02" },
  { label: "Workouts", n: "03" },
  { label: "Collections", n: "04" },
];

const PROGRESS = {
  holdS1End: 0.1,
  arriveS2: 0.38,
  holdS2End: 0.55,
  arriveS3: 0.85,
} as const;

const POSITION_KEYS = [
  0,
  PROGRESS.holdS1End,
  PROGRESS.arriveS2,
  PROGRESS.holdS2End,
  PROGRESS.arriveS3,
  1,
];

function MigratingCard({
  card,
  progress,
}: {
  card: CardConfig;
  progress: MotionValue<number>;
}) {
  const x = useTransform(
    progress,
    POSITION_KEYS,
    [card.s1.x, card.s1.x, card.s2.x, card.s2.x, card.s3.x, card.s3.x]
  );
  const y = useTransform(
    progress,
    POSITION_KEYS,
    [card.s1.y, card.s1.y, card.s2.y, card.s2.y, card.s3.y, card.s3.y]
  );
  const scale = useTransform(
    progress,
    [0, PROGRESS.holdS1End, PROGRESS.arriveS2 - 0.05, PROGRESS.arriveS2, PROGRESS.holdS2End, PROGRESS.arriveS3 - 0.05, PROGRESS.arriveS3, 1],
    [1, 1, 0.94, 1, 1, 0.94, 1, 1]
  );

  const opacityS1 = useTransform(
    progress,
    [0, 0.08, 0.28, 0.38],
    [1, 1, 0, 0]
  );
  const opacityS2 = useTransform(
    progress,
    [0.12, 0.28, 0.38, PROGRESS.holdS2End, 0.62, 0.78],
    [0, 1, 1, 1, 0, 0]
  );
  const opacityS3 = useTransform(
    progress,
    [0.62, 0.78, PROGRESS.arriveS3, 1],
    [0, 1, 1, 1]
  );

  const left = useMotionTemplate`${x}%`;
  const top = useMotionTemplate`${y}%`;

  return (
    <motion.div
      className="pointer-events-none absolute z-[25] w-max -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, scale }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 4.8 + card.delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: card.delay,
        }}
      >
        <div className="relative min-h-[3.25rem] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-4 py-3"
            style={{ opacity: opacityS1 }}
          >
            <CardText label={card.s1.label} value={card.s1.value} />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-4 py-3"
            style={{ opacity: opacityS2 }}
          >
            <CardText label={card.s2.label} value={card.s2.value} />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-4 py-3"
            style={{ opacity: opacityS3 }}
          >
            <CardText label={card.s3.label} value={card.s3.value} />
          </motion.div>
          <div className="invisible px-0 py-0" aria-hidden>
            <CardText label={card.s3.label} value={card.s3.value} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardText({ label, value }: CardContent) {
  return (
    <>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap text-sm font-medium text-white/90">
        {value}
      </p>
    </>
  );
}

function FirstPanel() {
  return (
    <div className="relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden bg-black">
      <Image
        src="/figure.png"
        alt=""
        width={1024}
        height={625}
        priority
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-auto w-[64vw] max-w-[1000px] -translate-x-1/2 select-none object-contain"
      />

      <div className="absolute left-1/2 top-[11%] z-30 -translate-x-1/2 text-center">
        <p className="text-[clamp(0.6rem,1.1vw,0.95rem)] font-light uppercase tracking-[0.35em] text-white/80">
          The Reset Button
        </p>
        <h1 className="mt-2 text-[clamp(1.1rem,3vw,2.4rem)] font-bold uppercase leading-none tracking-tight text-white">
          You Have Been Waiting For
        </h1>
      </div>

      <div className="absolute bottom-[7%] left-1/2 z-30 flex -translate-x-1/2 gap-[clamp(2rem,7vw,7rem)]">
        {NAV.map((item) => (
          <div key={item.n} className="text-center">
            <p className="text-[clamp(0.55rem,0.8vw,0.7rem)] font-medium uppercase tracking-[0.2em] text-white/90">
              {item.label}
            </p>
            <p className="mt-1 text-[clamp(0.5rem,0.7vw,0.62rem)] tracking-[0.2em] text-white/35">
              {item.n}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecondPanel() {
  return (
    <div className="relative flex h-screen w-screen shrink-0 items-center overflow-hidden bg-black">
      <Image
        src="/girl.png"
        alt=""
        width={1269}
        height={1240}
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-auto w-[48vw] max-w-[720px] select-none object-contain"
      />

      <div className="absolute right-[8%] top-1/2 z-10 max-w-[42vw] -translate-y-1/2 text-right">
        <p className="text-[clamp(0.6rem,1.1vw,0.95rem)] font-light uppercase tracking-[0.35em] text-white/80">
          Train Without Limits
        </p>
        <h2 className="mt-2 text-[clamp(1.1rem,3vw,2.4rem)] font-bold uppercase leading-none tracking-tight text-white">
          Your Body Is The Only Equipment You Need
        </h2>
      </div>
    </div>
  );
}

function ThirdPanel() {
  return (
    <div className="relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden bg-black px-[3vw]">
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-[clamp(1rem,3vh,2rem)] text-center text-[clamp(0.6rem,1.1vw,0.95rem)] font-light uppercase tracking-[0.35em] text-white/80">
          Rise To The Challenge
        </p>

        <div className="flex items-center justify-center gap-[clamp(0.75rem,2vw,2rem)]">
          <h2 className="max-w-[min(22vw,240px)] text-right text-[clamp(1.4rem,3.8vw,3.2rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
            Strength Is Built
          </h2>

          <Image
            src="/image.png"
            alt=""
            width={771}
            height={1173}
            className="pointer-events-none h-[clamp(260px,54vh,640px)] w-auto shrink-0 select-none object-contain"
          />

          <h2 className="max-w-[min(22vw,240px)] text-left text-[clamp(1.4rem,3.8vw,3.2rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
            One Rep At A Time
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.0005,
  });

  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-200vw"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-black"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          {SECTIONS.map((n) =>
            n === 1 ? (
              <FirstPanel key={n} />
            ) : n === 2 ? (
              <SecondPanel key={n} />
            ) : (
              <ThirdPanel key={n} />
            )
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-20">
          {CARDS.map((card) => (
            <MigratingCard key={card.id} card={card} progress={smoothProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

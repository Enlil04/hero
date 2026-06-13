"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import SiteHeader from "./site-header";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

const SECTIONS = [1, 2, 3];
const MOBILE_BREAKPOINT = 768;

type CardContent = { label: string; value: string };

type CardPoint = CardContent & {
  x: number;
  y: number;
  mobile: { x: number; y: number };
};

type CardConfig = {
  id: string;
  s1: CardPoint;
  s2: CardPoint;
  s3: CardPoint;
  delay: number;
};

const CARDS: CardConfig[] = [
  {
    id: "members",
    s1: { label: "Members", value: "2.4k active", x: 5, y: 34, mobile: { x: 10, y: 24 } },
    s2: { label: "Flexibility", value: "94% score", x: 44, y: 20, mobile: { x: 12, y: 20 } },
    s3: { label: "Power", value: "+18% gain", x: 18, y: 30, mobile: { x: 12, y: 38 } },
    delay: 0,
  },
  {
    id: "programs",
    s1: { label: "Programs", value: "18 plans", x: 12, y: 56, mobile: { x: 10, y: 42 } },
    s2: { label: "Balance", value: "Level 8", x: 50, y: 36, mobile: { x: 88, y: 22 } },
    s3: { label: "Deadlift", value: "140 kg", x: 82, y: 28, mobile: { x: 88, y: 36 } },
    delay: 0.5,
  },
  {
    id: "recovery",
    s1: { label: "Recovery", value: "92% score", x: 24, y: 65, mobile: { x: 10, y: 58 } },
    s2: { label: "Mindfulness", value: "Daily", x: 34, y: 50, mobile: { x: 12, y: 54 } },
    s3: { label: "PRs", value: "6 this month", x: 12, y: 50, mobile: { x: 10, y: 56 } },
    delay: 1,
  },
  {
    id: "streak",
    s1: { label: "Streak", value: "14 days", x: 95, y: 34, mobile: { x: 90, y: 24 } },
    s2: { label: "Posture", value: "A+", x: 52, y: 58, mobile: { x: 86, y: 52 } },
    s3: { label: "Form", value: "9.2 score", x: 88, y: 48, mobile: { x: 88, y: 54 } },
    delay: 0.3,
  },
  {
    id: "sessions",
    s1: { label: "Sessions", value: "6 / week", x: 88, y: 56, mobile: { x: 90, y: 42 } },
    s2: { label: "Core", value: "12 min", x: 38, y: 68, mobile: { x: 14, y: 72 } },
    s3: { label: "Volume", value: "12k lbs", x: 22, y: 70, mobile: { x: 14, y: 72 } },
    delay: 0.8,
  },
  {
    id: "calories",
    s1: { label: "Calories", value: "540 kcal", x: 76, y: 65, mobile: { x: 90, y: 58 } },
    s2: { label: "Breath", value: "4-7-8", x: 48, y: 74, mobile: { x: 86, y: 72 } },
    s3: { label: "Recovery", value: "24 hours", x: 78, y: 72, mobile: { x: 86, y: 72 } },
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function pickPoint(point: CardPoint, isMobile: boolean) {
  return isMobile ? point.mobile : { x: point.x, y: point.y };
}

function MigratingCard({
  card,
  progress,
  isMobile,
}: {
  card: CardConfig;
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  const s1 = pickPoint(card.s1, isMobile);
  const s2 = pickPoint(card.s2, isMobile);
  const s3 = pickPoint(card.s3, isMobile);

  const x = useTransform(
    progress,
    POSITION_KEYS,
    [s1.x, s1.x, s2.x, s2.x, s3.x, s3.x]
  );
  const y = useTransform(
    progress,
    POSITION_KEYS,
    [s1.y, s1.y, s2.y, s2.y, s3.y, s3.y]
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
  const cardScale = isMobile ? 0.88 : 1;

  return (
    <motion.div
      className="pointer-events-none absolute z-[25] w-max max-w-[42vw] -translate-x-1/2 -translate-y-1/2 md:max-w-none"
      style={{ left, top, scale }}
    >
      <motion.div
        style={{ scale: cardScale }}
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 4.8 + card.delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: card.delay,
        }}
      >
        <div className="relative min-h-[2.75rem] rounded-lg border border-[#1A1A1C]/12 bg-[#1A1A1C]/[0.03] px-3 py-2 shadow-sm md:min-h-[3.25rem] md:rounded-xl md:px-4 md:py-3">
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-3 py-2 md:px-4 md:py-3"
            style={{ opacity: opacityS1 }}
          >
            <CardText label={card.s1.label} value={card.s1.value} />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-3 py-2 md:px-4 md:py-3"
            style={{ opacity: opacityS2 }}
          >
            <CardText label={card.s2.label} value={card.s2.value} />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-3 py-2 md:px-4 md:py-3"
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
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#942221] md:text-[10px] md:tracking-[0.2em]">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium text-[#1A1A1C] md:mt-1 md:whitespace-nowrap md:text-sm">
        {value}
      </p>
    </>
  );
}

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-[100dvw] shrink-0 overflow-hidden bg-[#DADADA]">
      {children}
    </div>
  );
}

function FirstPanel() {
  return (
    <PanelShell>
      <div className="flex h-full flex-col">
        <div className="z-30 shrink-0 px-2 pt-[clamp(0.25rem,1.5vh,1rem)] text-center md:px-0">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.22em] text-[#942221] sm:text-[clamp(0.6rem,1.1vw,0.95rem)] md:tracking-[0.35em]">
            The Reset Button
          </p>
          <h1 className="mt-2 text-[clamp(1.25rem,6.5vw,2.4rem)] font-bold uppercase leading-[1.05] tracking-tight text-[#1A1A1C] md:leading-none">
            You Have Been Waiting For
          </h1>
        </div>

        <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center px-2 py-[clamp(0.5rem,2vh,1.5rem)]">
          <Image
            src="/gray-images/image1.png"
            alt=""
            width={1024}
            height={625}
            unoptimized
            priority
            className="pointer-events-none h-auto max-h-full w-auto max-w-[min(88vw,1000px)] select-none object-contain sm:max-w-[min(72vw,1000px)] md:max-w-[min(64vw,1000px)]"
          />
        </div>

        <div className="z-30 shrink-0 px-2 pb-[clamp(0.75rem,3vh,2rem)] md:px-0">
          <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-3 md:flex md:w-auto md:max-w-none md:justify-center md:gap-[clamp(2rem,7vw,7rem)]">
            {NAV.map((item) => (
              <div key={item.n} className="text-center">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#1A1A1C] sm:text-[clamp(0.55rem,0.8vw,0.7rem)] md:tracking-[0.2em]">
                  {item.label}
                </p>
                <p className="mt-1 text-[0.55rem] tracking-[0.16em] text-[#942221] sm:text-[clamp(0.5rem,0.7vw,0.62rem)] md:tracking-[0.2em]">
                  {item.n}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function SecondPanel() {
  return (
    <PanelShell>
      <Image
        src="/gray-images/image2.png"
        alt=""
        width={1269}
        height={1240}
        unoptimized
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-auto w-[78vw] max-w-[520px] -translate-x-1/2 select-none object-contain md:left-0 md:w-[48vw] md:max-w-[720px] md:translate-x-0"
      />

      <div className="absolute inset-x-0 top-[10%] z-10 px-5 text-center md:inset-x-auto md:right-[8%] md:top-1/2 md:max-w-[42vw] md:-translate-y-1/2 md:px-0 md:text-right">
        <p className="text-[0.65rem] font-light uppercase tracking-[0.22em] text-[#942221] sm:text-[clamp(0.6rem,1.1vw,0.95rem)] md:tracking-[0.35em]">
          Train Without Limits
        </p>
        <h2 className="mt-2 text-[clamp(1.2rem,5.5vw,2.4rem)] font-bold uppercase leading-[1.05] tracking-tight text-[#1A1A1C] md:leading-none">
          Your Body Is The Only Equipment You Need
        </h2>
      </div>
    </PanelShell>
  );
}

function ThirdPanel() {
  return (
    <PanelShell>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-8 md:px-[3vw] md:py-0">
        <p className="mb-4 text-center text-[0.65rem] font-light uppercase tracking-[0.22em] text-[#942221] sm:text-[clamp(0.6rem,1.1vw,0.95rem)] md:mb-[clamp(1rem,3vh,2rem)] md:tracking-[0.35em]">
          Rise To The Challenge
        </p>

        <div className="flex w-full max-w-5xl flex-col items-center gap-3 md:flex-row md:justify-center md:gap-[clamp(0.75rem,2vw,2rem)]">
          <h2 className="text-center text-[clamp(1.35rem,6vw,3.2rem)] font-bold uppercase leading-[0.95] tracking-tight text-[#1A1A1C] md:max-w-[min(22vw,240px)] md:text-right md:leading-[0.92]">
            Strength Is Built
          </h2>

          <Image
            src="/gray-images/image3.png"
            alt=""
            width={771}
            height={1173}
            unoptimized
            className="pointer-events-none h-[34vh] w-auto shrink-0 select-none object-contain sm:h-[40vh] md:h-[clamp(260px,54vh,640px)] md:translate-x-8"
          />

          <h2 className="text-center text-[clamp(1.35rem,6vw,3.2rem)] font-bold uppercase leading-[0.95] tracking-tight text-[#1A1A1C] md:max-w-[min(22vw,240px)] md:text-left md:leading-[0.92]">
            One Rep At A Time
          </h2>
        </div>
      </div>
    </PanelShell>
  );
}

export default function HorizontalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.0005,
  });

  const x = useTransform(smoothProgress, [0, 1], ["0dvw", "-200dvw"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300dvh] bg-[#DADADA]"
      aria-label="Hero"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden bg-[#DADADA]">
        <SiteHeader />

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <motion.div style={{ x }} className="flex h-full w-[300dvw]">
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
              <MigratingCard
                key={card.id}
                card={card}
                progress={smoothProgress}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

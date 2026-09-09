"use client";

import CountUp from "react-countup";

export default function AnimatedCount({
  end,
  suffix = "",
  duration = 2.5,
}) {
  return (
    <>
      <CountUp
        start={0}
        end={end}
        duration={duration}
      />
      {suffix}
    </>
  );
}
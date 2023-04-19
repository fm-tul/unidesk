import { EnvironmentType } from "@models/EnvironmentType";
import { useEffect, useRef } from "react";
import { classnames } from "ui/shared";

export interface EnvTagProps {
  environment: EnvironmentType;
  visible: boolean;
}

export const EnvTag = (props: EnvTagProps) => {
  const { environment, visible } = props;
  const colors = envColors[environment];
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const distanceFromTopRight = Math.abs(document.body.clientWidth - e.clientX) + Math.abs(e.clientY);
        // the closer the less opacity
        const opacity = Math.max(0.1, distanceFromTopRight / 500);
        ref.current.style.opacity = opacity.toString();
      }
    };
    document.addEventListener("mousemove", mouseMove);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  
  if (!visible) {
    return null;
  }

  return (
    <div ref={ref} className="pointer-events-none fixed top-0 right-0 z-[999] h-[200px] w-[200px] text-2xl text-white">
      <div
        className={classnames("relative top-10 -right-10 rotate-45 transform select-none bg-gradient-to-r text-center shadow-xl", colors)}
      >
        {environment}
      </div>
    </div>
  );
};

const envColors = {
  [EnvironmentType.LOCAL]: "from-slate-400 to-slate-500",
  [EnvironmentType.DEV]: "from-green-500 to-teal-600",
  [EnvironmentType.TEST]: "from-amber-500 to-yellow-600",
  [EnvironmentType.PROD]: "from-red-500 to-rose-600",
};

export default EnvTag;

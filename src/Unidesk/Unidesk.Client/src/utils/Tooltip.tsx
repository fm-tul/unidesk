// @ts-ignore
// import TooltipImpl from "react-simple-tooltip";
import TooltipImpl from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

interface TooltipProps {
  content: any;
  arrow?: number;
  background?: string;
  border?: string;
  color?: string;
  customCss?: any;
  fadeDuration?: number;
  fadeEasing?: string;
  fixed?: boolean;
  fontFamily?: boolean;
  fontSize?: boolean;
  padding?: number;
  placement?: "left" | "top" | "right" | "bottom";
  radius?: number;
  zIndex?: number;
}
export const Tooltip = (props: React.PropsWithChildren<TooltipProps>) => {
  const { children, content } = props;

  return (
    <TooltipImpl overlay={content} overlayClassName="shadow-xl max-w-sm rounded-lg" mouseLeaveDelay={0.15} showArrow={false}>
      <span>{children as any}</span>
    </TooltipImpl>
  );
};

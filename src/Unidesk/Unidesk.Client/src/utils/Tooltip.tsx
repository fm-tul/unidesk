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
  // const {
  //   fadeDuration = 100,
  //   placement = "right",
  //   background = "rgba(255, 255, 255, 0.75)",
  //   color = "#000000",
  //   border = "rgba(0, 0, 0, 0.17)",
  // } = rest;

  // return (
  //   <TooltipImpl
  //     {...rest}
  //     background={background}
  //     color={color}
  //     border={border}
  //     fadeDuration={fadeDuration}
  //     padding={8}
  //     placement={placement}
  //     fontFamily="inherit; max-width: 420px; width: max-content; backdrop-filter: blur(2px); border-radius: 4px;"
  //     arrow={0}
  //   >
  //     {children}
  //   </TooltipImpl>
  // );

  return (
    <TooltipImpl overlay={content} overlayClassName="shadow-xl max-w-xs rounded-lg" mouseLeaveDelay={0.15}>
      <span>{children as any}</span>
    </TooltipImpl>
  );
};

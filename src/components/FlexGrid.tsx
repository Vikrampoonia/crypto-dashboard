import React from "react";
import { styled } from "@mui/material/styles";

interface FlexGridProps {
  children: React.ReactNode;
  gap?: number;
}

const FlexContainer = styled("div")<FlexGridProps>(({ gap = 16 }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: `${gap}px`,
}));

interface FlexItemProps {
  children: React.ReactNode;
}

const FlexItem = styled("div")<FlexItemProps>(() => ({
  flex: "1 1 100%", // default full width

  // Tablet (2 columns)
  "@media (min-width:600px)": {
    flex: "1 1 calc(50% - 16px)",
  },

  // Desktop (3 columns)
  "@media (min-width:900px)": {
    flex: "1 1 calc(33.333% - 16px)",
  },

  boxSizing: "border-box",
}));

export const FlexGrid = ({ children, gap }: FlexGridProps) => {
  return <FlexContainer gap={gap}>{children}</FlexContainer>;
};

export const FlexGridItem = ({ children }: FlexItemProps) => {
  return <FlexItem>{children}</FlexItem>;
};

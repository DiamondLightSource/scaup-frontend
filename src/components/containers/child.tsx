import { Button, ButtonProps } from "@chakra-ui/react";

export interface GenericChildSlotProps extends ButtonProps {
  hasSample: boolean;
  label: number | string;
}

export const GenericChildSlot = ({ hasSample, label, ...props }: GenericChildSlotProps) => (
  <Button
    data-testid={`${label}-${hasSample ? "populated" : "empty"}`}
    position='absolute'
    variant={hasSample ? "default" : "outline"}
    bgColor={hasSample ? "diamond.700" : "diamond.75"}
    borderRadius='100%'
    border='3px solid'
    borderColor='diamond.700'
    h='40px'
    w='40px'
    {...props}
  >
    {label}
  </Button>
);

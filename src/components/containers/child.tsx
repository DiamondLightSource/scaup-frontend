import {
  Button,
  ButtonProps,
  Card,
  CardProps,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

export interface GenericChildCardProps extends CardProps {
  name: string;
  type: string;
}

export interface GenericChildSlotProps extends ButtonProps {
  hasSample: boolean;
  label: number | string;
}

export const GenericChildCard = ({ name, type, ...props }: GenericChildCardProps) => {
  return (
    <Card
      variant='filled'
      my='2'
      borderRadius='0'
      border='1px solid'
      borderLeft='5px solid'
      borderColor='diamond.800'
      {...props}
    >
      <Stat>
        <StatLabel>{type}</StatLabel>
        <StatNumber>{name}</StatNumber>
      </Stat>
    </Card>
  );
};

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

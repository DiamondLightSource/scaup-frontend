import { Card, CardProps, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export interface GenericChildCardProps extends CardProps {
  name: string;
  type: string;
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

import { components } from "@/types/schema";
import { formatDate } from "@/utils/generic";
import {
  VStack,
  Heading,
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "@chakra-ui/react";

interface TrackingHistoryProps {
  history?: components["schemas"]["TopLevelContainerHistory"][] | null;
  height?: string;
}

export const TrackingHistory = ({ history, height = "20em" }: TrackingHistoryProps) => {
  return (
    <Box w='100%' overflowY='scroll' h={height} p='1em'>
      {history && history.length > 0 ? (
        <Stepper index={0} orientation='vertical' maxH='400px' gap='0' size='sm'>
          {history.map((item, index) => (
            <Step key={index}>
              <StepIndicator
                sx={{
                  "[data-status=active] &": {
                    background: "diamond.800",
                    borderColor: "diamond.800",
                    color: "diamond.50",
                  },
                  "[data-status=incomplete] &": {
                    background: "diamond.50",
                    borderColor: "diamond.700",
                  },
                }}
              >
                <StepStatus />
              </StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{item.dewarStatus}</StepTitle>
                <StepDescription>
                  {item.storageLocation}
                  {item.storageLocation ? " - " : ""}
                  {formatDate(item.arrivalDate || "")}
                </StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      ) : (
        <Heading size='md' variant='notFound'>
          No history found for this dewar
        </Heading>
      )}
    </Box>
  );
};

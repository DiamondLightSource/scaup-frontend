"use client";

import { DynamicForm } from "@/components/input/form";
import { DynamicFormEntry } from "@/components/input/form/input";
import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import {
  Button,
  Checkbox,
  Heading,
  VStack,
  useToast,
  Text,
  Divider,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { authenticatedFetch } from "@/utils/client";
import { Table } from "@diamondlightsource/ui-components";

interface SessionData {
  session: string;
}

const sessionForm = [
  {
    id: "session",
    label: "Session",
    hint: "Session to use, e.g.: cm1234-5",
    type: "text",
    validation: {
      required: "Required",
      pattern: {
        value: /^[a-zA-Z]{1,2}[0-9]+-[0-9]+$/,
        message: "Session reference is invalid",
      },
    },
  },
] as DynamicFormEntry[];

const SessionList = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formContextSession = useForm<SessionData>();
  const [samples, setSamples] = useState<components["schemas"]["SampleOut"][] | null | undefined>();

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const onSubmitSession = formContextSession.handleSubmit(async (info) => {
    const sessionRegexMatches = info.session.match(/^([a-zA-Z]{1,2})([0-9]+)-([0-9]+)$/);
    if (sessionRegexMatches === null || sessionRegexMatches.length != 4) {
      toast({ title: "Session reference is invalid" });
      return;
    }

    const [, code, number, visitNumber] = sessionRegexMatches;

    const res = await authenticatedFetch.client(
      `/proposals/${code}${number}/sessions/${visitNumber}/samples`,
    );

    if (res && res.status === 200) {
      const samples = await res.json();
      setSamples(samples.items);
    } else {
      setSamples(null);
    }
  });

  const handleContinue = useCallback(() => {
    console.log(samples!.filter((_, i) => checkedItems.includes(i.toString())));
  }, [samples, checkedItems]);

  return (
    <VStack alignItems='start' w='100%'>
      <FormProvider {...formContextSession}>
        <form
          onSubmit={onSubmitSession}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20em",
            flex: "1 0 auto",
          }}
        >
          <DynamicForm formType={sessionForm} />
          <Button w='150px' mt='1em' type='submit' isLoading={isLoading}>
            Select
          </Button>
        </form>
      </FormProvider>
      <Heading mt='1em' color={samples ? undefined : "diamond.200"}>
        Select Samples
      </Heading>
      {samples && (
        <VStack divider={<Divider borderColor='diamond.600' />} w='66%'>
          <CheckboxGroup
            onChange={(values: string[]) => {
              setCheckedItems(values);
            }}
          >
            <VStack w='100%' divider={<Divider />}>
              {samples.map((sample, i) => (
                <Checkbox w='100%' value={i.toString()} key={i}>
                  <Heading flex='1 0 0' size='md'>
                    {sample.name}
                  </Heading>
                  <Text>{sample.comments}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </VStack>
      )}
      <Button onClick={handleContinue} bg='green.500' isDisabled={false}>
        Continue
      </Button>
    </VStack>
  );
};

const ImportSamplesPageContent = ({ params }: { params: ShipmentParams }) => {
  const handleContinue = useCallback(() => {}, []);

  return (
    <VStack w='100%' h='100%'>
      <SessionList />
    </VStack>
  );
};

export default ImportSamplesPageContent;

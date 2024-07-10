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
  HStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { authenticatedFetch } from "@/utils/client";

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

const SessionList = ({
  onSubmit,
}: {
  onSubmit: (samples: components["schemas"]["SampleOut"][]) => void;
}) => {
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

    setIsLoading(true);
    const res = await authenticatedFetch.client(
      `/proposals/${code}${number}/sessions/${visitNumber}/samples`,
    );
    setIsLoading(false);

    if (res && res.status === 200) {
      const samples = await res.json();
      setSamples(samples.items);
    } else {
      setSamples(null);
    }
  });

  const handleContinue = useCallback(() => {
    onSubmit(samples!.filter((_, i) => checkedItems.includes(i.toString())));
  }, [samples, checkedItems, onSubmit]);

  return (
    <VStack alignItems='start' w='100%'>
      <FormProvider {...formContextSession}>
        <form
          onSubmit={onSubmitSession}
          style={{width: "100%"}}
        >
          <DynamicForm formType={sessionForm} />
          <Button w='150px' mt='1em' type='submit' isLoading={isLoading}>
            Select
          </Button>
        </form>
      </FormProvider>
      <Heading size="lg" mt='1em' color={samples ? undefined : "diamond.200"}>
        Select Samples
      </Heading>
      {samples && (
        <VStack divider={<Divider borderColor='diamond.600' />} w='100%'>
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
      <Button
        mt='1em'
        onClick={handleContinue}
        bg='green.500'
        isDisabled={!samples || checkedItems.length < 1}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </VStack>
  );
};

const SessionLocationForms = ({
  selectedSamples, onReset
}: {
  selectedSamples: components["schemas"]["SampleOut"][];
  onReset: () => void
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formContext = useForm<SessionData>();

  const renderedForm = useMemo(
    () =>
      selectedSamples.reduce<DynamicFormEntry[]>((forms, sample) => {
        return forms.concat([
          { id: `separator-${sample.id}`, label: sample.name ?? "Unknown Name", type: "separator" },
          { id: `location-${sample.id}`, label: "Location", type: "text" },
        ]);
      }, []),
    [selectedSamples],
  );

  const onSubmit = useCallback(async (info) => {}, []);

  return (
    <VStack mt="1em" alignItems='start' w='100%'>
      <Heading size="lg">Facility Locations</Heading>
      <FormProvider {...formContext}>
        <form
          onSubmit={onSubmit}
          style={{width: "100%"}}
        >
          <DynamicForm formType={renderedForm} />
          <HStack><Button mt='1em' onClick={() => onReset()}>Back</Button>
          <Button mt='1em' type='submit' bg='green.500' isLoading={isLoading}>
            Finish
          </Button></HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

const ImportSamplesPageContent = ({ params }: { params: ShipmentParams }) => {
  const [selectedSamples, setSelectedSamples] = useState<
    components["schemas"]["SampleOut"][] | null
  >(null);

  return (
    <VStack w={{base: "100%", md: '33%'}} h='100%'>
      {selectedSamples ? (
        <SessionLocationForms selectedSamples={selectedSamples} onReset={() => setSelectedSamples(null)}/>
      ) : (
        <SessionList onSubmit={setSelectedSamples} />
      )}
    </VStack>
  );
};

export default ImportSamplesPageContent;

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
import { Item } from "@/utils/client/item";

interface SessionData {
  session: string;
}

const sessionForm = [
  {
    id: "session",
    label: "Session",
    hint: "Session number to use",
    type: "text",
    validation: {
      required: "Required",
      pattern: {
        value: /^[0-9]+$/,
        message: "Session number is invalid",
      },
    },
  },
] as DynamicFormEntry[];

const ImportSamplesPageContent = ({
  params,
  isNew,
}: {
  params: ShipmentParams;
  isNew: boolean;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formContextSession = useForm<SessionData>();
  const [samples, setSamples] = useState<components["schemas"]["SampleOut"][] | null | undefined>();

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const onSubmitSession = formContextSession.handleSubmit(async (info) => {
    setIsLoading(true);
    const res = await authenticatedFetch.client(
      `/proposals/${params.proposalId}/sessions/${info.session}/samples?isInternal=true`,
    );
    setIsLoading(false);

    if (res && res.status === 200) {
      const samples = await res.json();
      setSamples(samples.items);
    } else {
      setSamples(null);
    }
  });

  const handleFinish = useCallback(async () => {
    if (samples) {
      try {
        await Promise.all(
          samples!.map((sample) =>
            Item.patch(sample.id, { shipmentId: params.shipmentId }, "samples"),
          ),
        );

        // TODO: replace this with server actions?
        window.location.assign(isNew ? "pre-session" : "./");
      } catch {
        toast({ title: "Could not update items, please try again later", status: "error" });
      }
    }
  }, [samples, params, isNew, toast]);

  return (
    <VStack alignItems='start' w='100%'>
      <FormProvider {...formContextSession}>
        <form onSubmit={onSubmitSession} style={{ width: "100%" }}>
          <DynamicForm formType={sessionForm} />
          <Button w='150px' mt='1em' type='submit' isLoading={isLoading}>
            Select
          </Button>
        </form>
      </FormProvider>
      <Heading size='lg' mt='1em' color={samples !== undefined ? undefined : "diamond.200"}>
        Select Samples
      </Heading>
      {samples && samples.length > 0 ? (
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
      ) : (
        samples !== undefined && (
          <Heading variant='notFound' size='md'>
            No samples available for transfer in this session.
          </Heading>
        )
      )}
      <Button
        mt='1em'
        onClick={handleFinish}
        bg='green.500'
        isDisabled={!samples || checkedItems.length < 1}
        isLoading={isLoading}
      >
        {isNew ? "Continue" : "Finish"}
      </Button>
    </VStack>
  );
};

export default ImportSamplesPageContent;

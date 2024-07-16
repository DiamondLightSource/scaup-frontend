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
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { authenticatedFetch } from "@/utils/client";
import { Item } from "@/utils/client/item";
import { useRouter } from "next/navigation";

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

const ImportSamplesPageContent = ({
  params,
  isNew,
}: {
  params: ShipmentParams;
  isNew: boolean;
}) => {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formContextSession = useForm<SessionData>();
  const [containers, setContainers] = useState<
    components["schemas"]["ContainerOut"][] | null | undefined
  >();

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const onSubmitSession = formContextSession.handleSubmit(async (info) => {
    const sessionRegexMatches = info.session.match(/^([a-zA-Z]{1,2})([0-9]+)-([0-9]+)$/);
    if (sessionRegexMatches === null || sessionRegexMatches.length !== 4) {
      toast({ title: "Session reference is invalid" });
      return;
    }

    const [, code, number, visitNumber] = sessionRegexMatches;

    setIsLoading(true);
    const res = await authenticatedFetch.client(
      `/proposals/${code}${number}/sessions/${visitNumber}/containers?isInternal=true`,
    );
    setIsLoading(false);

    if (res && res.status === 200) {
      const containers = await res.json();
      setContainers(containers.items);
    } else {
      setContainers(null);
    }
  });

  const handleFinish = useCallback(async () => {
    if (containers) {
      await Promise.all(
        containers!.map((container) =>
          Item.patch(container.id, { shipmentId: params.shipmentId }, "containers"),
        ),
      );

      // TODO: replace this with server actions?
      window.location.assign(isNew ? "pre-session" : "./");
    }
  }, [containers, params, isNew]);

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
      <Heading size='lg' mt='1em' color={containers !== undefined ? undefined : "diamond.200"}>
        Select Containers
      </Heading>
      {containers && containers.length > 0 ? (
        <VStack divider={<Divider borderColor='diamond.600' />} w='100%'>
          <CheckboxGroup
            onChange={(values: string[]) => {
              setCheckedItems(values);
            }}
          >
            <VStack w='100%' divider={<Divider />}>
              {containers.map((container, i) => (
                <Checkbox w='100%' value={i.toString()} key={i}>
                  <Heading flex='1 0 0' size='md'>
                    {container.name}
                  </Heading>
                  <Text>{container.comments}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </VStack>
      ) : (
        containers !== undefined && (
          <Heading variant='notFound' size='md'>
            No containers available for transfer in this session.
          </Heading>
        )
      )}
      <Button
        mt='1em'
        onClick={handleFinish}
        bg='green.500'
        isDisabled={!containers || checkedItems.length < 1}
        isLoading={isLoading}
      >
        {isNew ? "Continue" : "Finish"}
      </Button>
    </VStack>
  );
};

export default ImportSamplesPageContent;

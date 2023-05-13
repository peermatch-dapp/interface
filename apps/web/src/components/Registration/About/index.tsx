import Title from '@components/Shared/Title';
import errorToast from '@lib/errorToast';
import uploadToArweave from '@lib/uploadToArweave';
import { LensPeriphery } from 'abis';
import { APP_NAME, LENS_PERIPHERY } from 'data';
import Errors from 'data/errors';
import type { CreatePublicSetProfileMetadataUriRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens';
import getSignature from 'lib/getSignature';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { Button, GridItemFull, GridLayout, Spinner, TextArea } from 'ui';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

const About: NextPage = ({ nextStep }: any) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [about, setAbout] = useState(currentProfile?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    nextStep();
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { error, write } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURI',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createSetProfileMetadataTypedData }) => {
        const { id, typedData } = createSetProfileMetadataTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          const { profileId, metadata } = typedData.value;
          return write?.({ args: [profileId, metadata] });
        }
      },
      onError
    });

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename),
      onError
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    });
    if (
      data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    }
  };

  const updateInformation = useCallback(async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      const id = await uploadToArweave({
        bio: about,
        attributes: [{ key: 'app', value: APP_NAME }],
        version: '1.0.0',
        metadata_id: uuid()
      });

      const request: CreatePublicSetProfileMetadataUriRequest = {
        profileId: currentProfile?.id,
        metadata: `https://arweave.net/${id}`
      };

      if (canUseRelay && isSponsored) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch (error) {
      // onError(error);
    }
  }, [
    about,
    canUseRelay,
    createSetProfileMetadataTypedData,
    createViaDispatcher,
    currentProfile,
    isSponsored
  ]);

  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>Tell us little bit about you</Title>
        <TextArea
          rows={6}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full"
        />
        <Button
          disabled={isLoading}
          className="w-48"
          onClick={() => updateInformation()}
        >
          {isLoading ? <Spinner size="sm" className="m-auto" /> : 'Next'}
        </Button>
        <Button
          disabled={isLoading}
          className="w-48"
          variant="secondary"
          onClick={() => nextStep()}
        >
          Skip
        </Button>
      </GridItemFull>
    </GridLayout>
  );
};

export default About;

import Title from '@components/Shared/Title';
import VerifyButton from '@components/VerifyButton';
import { Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { Button, GridItemFull, GridLayout } from 'ui';

const Verify: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>Do you want to get verified?</Title>
        <div className="text-center">
          <Trans>
            If you have a{' '}
            <a
              href="https://worldcoin.org/"
              target="_blank"
              className="underline"
            >
              Worldcoin
            </a>{' '}
            account you can connect to it and become verified ✅
          </Trans>
        </div>

        <VerifyButton next={nextStep}>
          <Button className="w-48">Verify</Button>
        </VerifyButton>
        <Button className="w-48" onClick={() => nextStep()}>
          Skip
        </Button>
      </GridItemFull>
    </GridLayout>
  );
};

export default Verify;

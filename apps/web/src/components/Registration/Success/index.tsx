import Title from '@components/Shared/Title';
import { Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const Success: NextPage = () => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>Congratulations</Title>

        <Trans>
          Your profile has been created and you can start your journey to find a
          peer.
        </Trans>

        {/* <Button className="w-48" onClick={() => nextStep()}>
          Next
        </Button> */}
      </GridItemEight>
    </GridLayout>
  );
};

export default Success;

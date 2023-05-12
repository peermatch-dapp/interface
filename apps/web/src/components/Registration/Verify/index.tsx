import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const Verify: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>Do you want to get verified?</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemEight>
    </GridLayout>
  );
};

export default Verify;

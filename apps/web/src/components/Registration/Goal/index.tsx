import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const Goal: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>What is your primary goal?</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemEight>
    </GridLayout>
  );
};

export default Goal;

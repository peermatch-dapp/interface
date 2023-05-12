import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const Interests: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>What are you interested in?</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemEight>
    </GridLayout>
  );
};

export default Interests;

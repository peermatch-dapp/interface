import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemFull, GridLayout } from 'ui';

const Verify: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>Do you want to get verified?</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemFull>
    </GridLayout>
  );
};

export default Verify;

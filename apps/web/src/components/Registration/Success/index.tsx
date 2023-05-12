import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const Success: NextPage = () => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>Success</Title>
      </GridItemEight>
    </GridLayout>
  );
};

export default Success;

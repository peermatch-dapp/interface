import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const ProfileType: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>What cofounder you are looking for?</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileType;

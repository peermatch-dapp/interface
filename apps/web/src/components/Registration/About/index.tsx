import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { GridItemEight, GridLayout } from 'ui';

const About: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>Tell us little bit about you</Title>
        <button onClick={() => nextStep()}>next</button>
      </GridItemEight>
    </GridLayout>
  );
};

export default About;

import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, GridItemEight, GridLayout, TextArea } from 'ui';

const About: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight className="m-auto flex max-w-4xl flex-col items-center gap-4">
        <Title>Tell us little bit about you</Title>
        <TextArea className="w-full" />
        <Button className="w-48" onClick={() => nextStep()}>
          Next
        </Button>
      </GridItemEight>
    </GridLayout>
  );
};

export default About;

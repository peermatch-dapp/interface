import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

import About from './About';
import Goal from './Goal';
import Interests from './Interests';
import ProfileType from './ProfileType';
import Success from './Success';
import Verify from './Verify';

const Registration: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const flow = useMemo(
    () => [Verify, About, Interests, Goal, ProfileType, Success],
    []
  );

  const nextStep = () =>
    setCurrentStep((step) => (step + 1 >= flow.length ? step : step + 1));

  const Component: any = flow[currentStep];

  return <Component nextStep={nextStep} />;
};

export default Registration;

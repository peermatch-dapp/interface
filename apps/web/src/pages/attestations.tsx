import Content from '@components/Content';
import React, { useState } from 'react';
import styled from 'styled-components';

const AppWrapper = styled.div`
  background-color: #f1f4f9;
`;

const ContentWrapper = styled.div`
  height: calc(100vh - 72px);
`;

export default function App() {
  const [activeContent, setActiveContent] = useState(0);

  return (
    <AppWrapper>
      <ContentWrapper>
        <Content
          activeContent={activeContent}
          setActiveContent={setActiveContent}
        />
      </ContentWrapper>
    </AppWrapper>
  );
}

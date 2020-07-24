import React from 'react';
import { Example } from 'components';

const Page = ({
  theme,
}) => {
  return (
      <Example
        Component={theme.example.Component}
      />
  );
};

export default Page;

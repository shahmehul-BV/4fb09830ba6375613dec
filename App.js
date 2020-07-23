import React from 'react';
import Routes from './app/src/Routes';
import {Root} from 'native-base';

console.disableYellowBox = true;

const App = () => {
  return (
    <Root>
      <Routes />
    </Root>
  );
};

export default App;

import React from 'react';
import {Container, Content, Text} from 'native-base';

const Details = ({route}) => {
  const {data} = route.params;

  return (
    <Container>
      <Content>
        <Text>{JSON.stringify(data)}</Text>
      </Content>
    </Container>
  );
};

export default Details;

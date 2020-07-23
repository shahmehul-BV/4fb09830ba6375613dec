import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Card, CardItem, Text, Body} from 'native-base';

const ListItem = ({data, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <CardItem>
          <Body>
            <Text>{data.item.title}</Text>
            <Text>{data.item.url}</Text>
            <Text>{data.item.created_at}</Text>
            <Text>{data.item.author}</Text>
          </Body>
        </CardItem>
      </Card>
    </TouchableOpacity>
  );
};

export default ListItem;

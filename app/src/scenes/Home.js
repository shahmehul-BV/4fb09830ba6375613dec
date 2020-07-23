import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {
  Container,
  Grid,
  Item,
  Input,
  Button,
  Icon,
  Row,
  Col,
  ActionSheet,
} from 'native-base';
import ListItem from '../components/ListItem';
import axios from 'axios';

var BUTTONS = ['By Title', 'By Date', 'Reset'];
var CANCLE_INDEX = 2;
var BUTTONS_INDEX = 1;

const Home = ({navigation}) => {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [searchText, setSearchText] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      intervalCall();
    }
  }, []);

  const intervalCall = () => {
    setInterval(() => {
      apiCall(0);
    }, 10000);
  };

  const apiCall = ({isIntervalCall}) => {
    axios
      .get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNo}`,
      )
      .then((res) => {
        if (isIntervalCall == 0) {
          let test = res.data.hits;
          let test2 = [];
          if (data.length() == 0) {
            setData([...data, ...res.data.hits]);
          } else {
            for (var i = 0; i < test.length(); i++) {
              for (var j = 0; j < data.length(); j++) {
                if (test[i].create_at_i == data[i].created_at_i) {
                  test2 = test[i];
                }
              }
            }

            setData([...data, ...test2]);
          }
        } else {
          setData([...data, ...res.data.hits]);
          setPageNo(pageNo + 1);
        }
      })
      .catch((err) => console.log(err));
  };

  const refreshData = () => {
    apiCall(0);
    setPageNo(0);
  };

  const handleSearch = () => {
    setIsSearching(true);
    if (isSearching) {
      if (searchText !== '') {
        let filterData = [...data];
        filterData = filterData.filter((item) => {
          if (
            item.title &&
            item.title.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return true;
          } else if (
            item.url &&
            item.url.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return true;
          } else if (
            item.author &&
            item.author.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return true;
          } else {
            false;
          }
        });
        setListData(data);
        setData([]);
        setData(filterData);
      } else if (searchText == '') {
        setData(listData);
        setListData([]);
        setIsSearching(false);
      }
    }
  };

  const showActionSheet = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCLE_INDEX,
        destructiveButtonIndex: BUTTONS_INDEX,
        title: 'Sort By',
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          sortByTitle();
        }
        if (buttonIndex == 1) {
          sortByDate();
        }
        if (buttonIndex == 2) {
          resetSort();
        }
      },
    );
  };

  const sortByTitle = () => {
    let filterData = [...data];
    filter = filterData.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    setListData(data);
    setData([]);
    setData(filterData);
  };

  const sortByDate = () => {
    let filterData = [...data];
    filterData = filterData.sort((a, b) => {
      return new Date(b.create_at) - new Date(a.create_at);
    });
    setListData(data);
    setData([]);
    setData(filterData);
  };

  const resetSort = () => {
    if (listData.length > 0) setData(listData);
    setListData([]);
  };

  return (
    <Container>
      <Grid>
        <Row size={1} style={{marginTop: 12}}>
          <Col size={5} style={{marginHorizontal: 5}}>
            <Item rounded>
              <Input
                placeholder="Search Title, Url, Author"
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch()}
              />
            </Item>
          </Col>
          <Col size={1}>
            <Button danger onPress={() => handleSearch()}>
              <Icon name="md-search"></Icon>
            </Button>
          </Col>
          <Col size={1}>
            <Button onPress={() => showActionSheet()}>
              <Icon name="md-list-outline"></Icon>
            </Button>
          </Col>
        </Row>
        <Row size={10} style={{marginHorizontal: 5}}>
          <FlatList
            data={data}
            renderItem={(item) => (
              <ListItem
                data={item}
                onPress={() =>
                  navigation.navigate('Details', {
                    data: item,
                  })
                }
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if (!isSearching) {
                apiCall(1);
              }
            }}
            onRefresh={() => refreshData()}
            refreshing={isRefreshing}
          />
        </Row>
      </Grid>
    </Container>
  );
};

export default Home;

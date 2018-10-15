# react-decorate-fetch
A library for React's fetch Api, very easy to separated state and view, similar to react-refetch

## Installation
Supporting for react and react-native
```sh
npm i react-decorate-fetch --save
```

## API

## Examples

#### Lazy Request
```javascript
@connect((props) => ({
  userFetch:{
    url: 'http://XXXXXXXXXXXXX/getUserInfo/'+ props.userId,
    mapResult: result => result.data.userInfo || {}
  }
}))

//OR

@connect((props) => ({
  userFetch:{
    url: 'http://yourHost/getUserInfo',
    params: {
      userId: props.userId
    },
    mapResult: result => result.data.userInfo || {}
  }
}))
```

#### Common Request
```javascript
// not need response State
@connect((props) => ({
  searchGood:  ({page = 1}) => ({
    url: 'http://yourHost/searchGood',
    params: {
      keyword: props.keyword,
      page: 0 || page,
      count: 10,
    },
  })
}))

// need response State
@connect((props) => ({
  searchGood:  ({page = 1}) => ({
    searchGoodFetch: {
      url: 'http://yourHost/searchGood',
      params: {
        keyword: props.keyword,
        page: 0 || page,
        count: 10,
      },
    }
  })
}))
```

#### Async Request
```javascript
// not need response State
@connect((props) => ({
  searchGood: ({page = 1}) => [
    {
      url: 'http://yourHost/searchGood',
      params: {
        keyword: props.keyword,
        page: 0 || page,
        count: 10,
      },
    },
    {
      url: 'http://yourHost/searchGood2',
      params: {
        keyword: props.keyword,
        page: 0 || page,
        count: 10,
      },
    }
  ]
}))

// need response State
@connect((props) => ({
  searchGood: ({page = 1}) => [
    {
      searchGoodFetch: {
        url: 'http://yourHost/searchGood',
        params: {
          keyword: props.keyword,
          page: 0 || page,
          count: 10,
        },
      }
    },
    {
      searchGood2Fetch: {
        url: 'http://yourHost/searchGood2',
        params: {
          keyword: props.keyword,
          page: 0 || page,
          count: 10,
        },
      }
    }
  ]
}))
```
#### Sync Request

```javascript
// not need response State
@connect((props) => ({
  searchGood: ({page = 1}) => [{
    url: 'http://yourHost/searchGood',
    params: {
      keyword: props.keyword,
      page: 0 || page,
      count: 10,
    },
    then: () => ({
      url: 'http://yourHost/searchGood2',
      params: {
        keyword: props.keyword,
        page: 0 || page,
        count: 10,
      },
    })
  }]
}))

// need response State
@connect((props) => ({
  searchGood: ({page = 1}) => ({
    searchGoodFetch: {
      url: 'http://yourHost/searchGood',
      params: {
        keyword: props.keyword,
        page: 0 || page,
        count: 10,
      },
      then: () => ({
        url: 'http://yourHost/searchGood2',
        params: {
          keyword: props.keyword,
          page: 0 || page,
          count: 10,
        },
      })
    }
  })
}))
```
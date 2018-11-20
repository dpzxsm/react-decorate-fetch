# react-decorate-fetch
A library for React's fetch Api, very easy to separated state and view, similar to react-refetch

## Installation
Supporting for react and react-native
```sh
npm i react-decorate-fetch --save
```

## API

#### Interfaces
 
 `FetchConfig: Object`
 ```
 {
   "url": string[fetch url],
   "params": object[query|json],
   "mapResult": function(result)[map fetch result],
   "then": function(result)[hook fetch's then, and support return a new FetchConfig]
 }
 ```
 
 `FetchResponse: Object`
 ```
 {
    "status": string('success'|'error'|'pending'),
    "loading": boolean,
    "code": number,
    "message": string('only when fetch error')
    "result": any
 }
 
 ```
 `FetchFunction: Function`
 ```
  need response State
 () => ({
   FetchResponseKey1: (FetchConfig),
   FetchResponseKey2: (FetchConfig)
 })
 
 not need response State
  () => [{
    FetchConfig1(FetchConfig),
    FetchConfig2(FetchConfig)
  }]
  
 ```

#### connect(mapRequestToProps: Function)
It is a HOC to connect React's Component, like react-redux
###### mapRequestToProps(ownProps)
 Map props to Fetch Requests and Responses, arguments is props, and return a Object. The key of the Object is props's name, the value of the Object allow tow type, object and function.
 1. if the return Object's value is a Object as `FetchConfig`, will recieve a `FetchResponse` as props
 2. if the return Object's value is a function return a Object as `FetchConfig` , will recieve a `FetchFunction` as props
 
#### initConfig(options: Object, mapResponse: Function)
Init fetch config
###### options
Special set default fetch config, like headers、cookie、defaultQuery
###### mapResponse
Map Response to formate data, like json, default is res.json()

## Examples

### If you are use decorate fetch
```javascript
@connect((props) => ({
  userFetch:{
    url: 'http://yourHost/getUserInfo/'+ props.userId,
    mapResult: result => result.data.userInfo || {}
  }
}))
export class Test extends Comment{
  render() {
    let { userFetch } = this.props
    if(userFetch.status === "success"){
      this.renderPage()
    }else if(userFetch.status === 'error'){
      this.renderError()
    }else if(userFetch.status === 'pending'){
      this.renderLoading()
    }
  }
}
```

### If you don't want use decorate
```javascript
class Test extends Comment{
  render() {
    let { userFetch } = this.props
    if(userFetch.status === "success"){
      this.renderPage()
    }else if(userFetch.status === 'error'){
      this.renderError()
    }else if(userFetch.status === 'pending'){
      this.renderLoading()
    }
  }
}

export default connect((props) => ({
  userFetch:{
    url: 'http://yourHost/getUserInfo/'+ props.userId,
    mapResult: result => result.data.userInfo || {}
  }
}))

````

#### Lazy Request
```javascript
@connect((props) => ({
  userFetch:{
    url: 'http://yourHost/getUserInfo/'+ props.userId,
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
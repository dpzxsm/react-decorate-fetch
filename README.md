# react-decorate-fetch [![npm version](https://badge.fury.io/js/react-decorate-fetch.svg)](https://badge.fury.io/js/react-decorate-fetch)
A library to fetch data for React Components, which has most of the similar API with [react-refetch](https://github.com/heroku/react-refetch). Different, it also supports more friendly way to use, like Hooks.

## Installation
Supporting for react and react-native, based on Fetch’s API;

```sh
npm i react-decorate-fetch --save
or
yarn add react-decorate-fetch
```
## Why I don't use react-refetch
`react-refetch` is a very awesome project,it  saved me a lot of time. I really like this way without setState to fetch data. Now, Hooks are growing in popularity, more projects use Hooks. So I write this library to supports Hooks, and Copy `react-refetch`’s API to compatible my old Projects.

## Example

```javascript
import { connect } from 'react-decorate-fetch';
function App(props) {
  const { userFetch } = props;
  if(userFetch.loading){
    return <Loading />
  }else if(userFetch.error){
    return <Error />
  }else if(userFetch.success){
    return <Success />
  }
}
export default connect((props) => ({
  userFetch: `/users/detail/${props.userId}`,
}))(App)
```

## API

### Use in your Component
#### HOC Component
```javascript
connect(mapRequestByOptions, defaultFetchOptions, options)(App)
```

##### mapRequestByOptions:[FetchOptions](#FetchOptions)|Function => [FetchOptions](#FetchOptions)
A Function to map props to [FetchOptions](#FetchOptions), if you don't need props, you can directly set FetchOptions, like:
```javascript
connect({usersFetch: `/users`})
````
##### defaultFetchOptions:[FetchOptions](#FetchOptions)
Default FetchOptions for connect Component, will be Object.assign into every `FetchOptions`

##### options:Object
withRef options to ref connect Component like `react-redux`

#### React Hooks
```javascript
let [fetchState, fetchFunction] = useFetch(fetchOptions, deps);
let lazyFetchState = useLazyFetch(fetchOptions, deps);
let lazyFetchStates = useLazyFetches([fetchOptions, fetchOptions], deps);
```
##### useFetch(options:[FetchOptions](#FetchOptions), deps?: any[]);
```javascript
const APP = (props) => {
  const fetchOptions = "/users";
  const [fetchState, fetchUser] = useFetch(fetchOptions, []);
  return <div>
   {fetchState.loading
        ? <div>Loading...</div>
        : fetchState.error
          ? <div>Error: {fetchState.message}</div>
          : <div>Value: {fetchState.value}</div>
      }
    <button onClick={() => fetchUser()}>Start Fetch</button>
  </div>
}
```

##### useLazyFetch(options:[FetchOptions](#FetchOptions), deps?: any[]);
```javascript
const APP = (props) => {
  const fetchOptions = "/users";
  const fetchState = useLazyFetch(fetchOptions, []);
  return <div>
   {fetchState.loading
        ? <div>Loading...</div>
        : fetchState.error
          ? <div>Error: {fetchState.message}</div>
          : <div>Value: {fetchState.value}</div>
      }
  </div>
}
```
##### useLazyFetches(options:[FetchOptions](#FetchOptions)[] , deps?: any[]);
```javascript
const APP = (props) => {
  const fetchOptions1 = "/users";
  const fetchOptions2 = "/schools";
  const [fetchState1, fetchState2] = useLazyFetches([fetchOptions1, fetchOptions2], []);
  return <div>
     {JSON.stringify(fetchState1)}
     {JSON.stringify(fetchState2)}
  </div>
}
```
### Global and Middleware
If you want to config some Global options for all fetches, you will need some useful api to resolve it. It is not necessary, but is helpful.
#### initConfig
```javascript
initConfig({
  fetchOptions: {
    host: 'http://xxx.com',
    globalParams: { version:'1.0', token: '69c5fcebaa65b560eaf06c3fbeb481ae44b8d618'},
    headers: {}, //override default headers
    ...otherFetchOptions
  },
  buildResponse: (res) => {
     // This is default response handle, you can override it.
     if (res && res.json) {
       return res.json().then((dataOrError) => {
         if (res.ok) {
           return dataOrError;
         } else {
           throw dataOrError;
         }
       });
     } else {
       return {};
     }
  },
  transformPostParams: (params) => {
    // This is default transform, you can override it.
    return JSON.stringify(params)
  }, // transform params Option
  fetch: require('axios') // you can replace to any you like Fetch Api's library
})
```
#### applyMiddleware
```javascript
const plugin = {
  before: (context, next) => {
    const options = context[0]; // the final fetchOptions
    next(); // must call only once
  },
  after: (context, next) => {
    const options = context[0]; // the final fetchOptions
    let data = context[1]; // you can modify
    next(); // must call  only once
  }
}
applyMiddleware(plugin)
// ......
// you can add multiple plugins
```

#### removeMiddleware
```javascript
removeMiddleware(plugin)
```

### Type Explanation
#### FetchOptions
`FetchOptions` based on Fetch API’s options, so you can use all Fetch API’s options

| Property      | Type     | Description              | Require | default |
| :------------ | :------: | :----------------------- | :-----: | :----- |
| **url**       | String   | The Fetch API’s url, if `value` is Static, it is not required.| true | —— |
| **method**    | String   | The Fetch API’s method | false | "GET" |
| **headers**   | Object   | The Fetch API’s headers | false | { 'Accept': 'application/json', 'Content-Type': 'application/json' } |
| **params**    | Object   | Common params for different `method`, look more| false | {} |
| **value**     | Function\|Any | Static response’s value or function to transform the old response’s value, look more | false | —— |
| **then**      | Function | Chaining Requests, look more | false | —— |
| **host**      | String   | Define the host, only use in [initConfig](#initConfig) | false | —— |
| **globalParams**| String | Define default params, only use in [initConfig](#initConfig) | false | —— |

Support all other Fetch API’s options, like `body`,`mode`,`credentials`,`cache`,`redirect`,`referrer`,`referrerPolicy`,`integrity`

#### FetchState 
| Property      | Type     | Description              | default |
| :------------ | :------: | :----------------------- | :----- |
| **status**    | String   | One of 'pending'\|'loading'\|'error' |'pending' |
| **loading**   | Boolean  | When fetching, that is true | false |
| **error**     | Boolean  | When fetch error or throw Error, that is true | false |
| **success**   | Boolean  | When fetch success, that is true | false |
| **code**      | Number   | Http code | —— |
| **message**   | String   | `FetchOptions`’s successText or error’s message | —— |
| **value**     | Any      | Chaining Requests, look more | —— |


## Development

**Frontend local development:** 

```
npm run serve
```

## Testing

**Requirements**

- selenoid (set up it first, see the official documentation).

**Run tests:**
 
```
npm run test
```

**View allure report and captured video:** 

Export path to report:

```sh
export TODO_APP_TEST_ALLURE_OUTPUT_DID=test-data.tmp/allure-output
# See wdio.conf.js for details
```

Then serve report on localhost:8000: 

```
npm run test-report
```

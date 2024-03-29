# Check Digit

The following endpoints allow users to generate and validate check digits either one at a time in JSON format or in a batch in CSV format.

This API is what powers the [Check Digit Tool](https://ffiec.cfpb.gov/tools/check-digit).

### Check Digit Endpoints

__Single Checkdigit Generation__

`POST https://ffiec.cfpb.gov/v2/public/uli/checkDigit`

This endpoint takes a single ULI in JSON format and returns a single two digit check digit in JSON format. 

__Batch Checkdigit Generation__

`POST https://ffiec.cfpb.gov/v2/public/uli/checkDigit/csv`

This endpoint takes multiple ULIs in CSV format and returns two digit check digits in CSV format.

__Single Checkdigit Validation__

`POST https://ffiec.cfpb.gov/v2/public/uli/validate`

This endpoint takes a single ULI with check digits in JSON format and returns whether it is valid in JSON format. 

__Batch Checkdigit Validation__

`POST https://ffiec.cfpb.gov/v2/public/uli/validate/csv`

This endpoint multiple ULIs with check digits in CSV format and returns whether they is valid in CSV format.

### Single Check Digit Generation

  `POST` request to get a single check digit.
  
  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/checkDigit
  Payload: {"loanId": "ULI"}
  ```

  #### Example
  
  **Request:**

  ```
  curl -X POST 'https://ffiec.cfpb.gov/v2/public/uli/checkDigit' \
  --header 'Content-Type: application/json' \
  --data-raw '{"loanId": "EILKZAIZF6TX4HB8ZDX33H"}'
  ```

  **Request:**

  ```json
  {
    "loanId":"EILKZAIZF6TX4HB8ZDX33H",
    "checkDigit":"54",
    "uli":"EILKZAIZF6TX4HB8ZDX33H54"
  }
  ```

### Batch Check Digit Generation

  `POST` request to get batch check digits.

  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/validate/csv
  Payload: CSV File as shown below
  ```

  #### Example
  
  **Request:**

  ```
  curl -X POST \
  "https://ffiec.cfpb.gov/v2/public/uli/validate/csv" \
  -F file=@<PATH>/check_digit_sample_file.csv
  ```

  **Request:**

  ```
  B90YWS6AFX2LGWOXJ1LDNIXOQ6O0000SLR6FSJJ5R87
  95GVQQ61RS6CWQF0SZD9F4VRXNN1OCVXHP1JURF9ZJS
  ```

  <b>CSV Response:</b>

  ```
  loanId,checkDigit,uli
  B90YWS6AFX2LGWOXJ1LDNIXOQ6O0000SLR6FSJJ5R87,51,B90YWS6AFX2LGWOXJ1LDNIXOQ6O0000SLR6FSJJ5R8751
  95GVQQ61RS6CWQF0SZD9F4VRXNN1OCVXHP1JURF9ZJS,92,95GVQQ61RS6CWQF0SZD9F4VRXNN1OCVXHP1JURF9ZJS92
  ```

### Batch Check Digit Generation (Bad Request)

  `POST` request to get batch check digits.

  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/validate/csv
  Payload: CSV File as shown below
  ```

  #### Example
  
  **Request:**

  ```
  curl -X POST \
  "https://ffiec.cfpb.gov/v2/public/uli/validate/csv" \
  -F file=@<PATH>/check_digit_sample_file.csv
  ```

  **Request:**

  ```
  BANK1LTEST123451150
  BANK1LEIFORTEST123458001
  BANK1LEIFORTEST123458003
  BANK1LEIFO!TEST123458234
  BANK343434733473438000034343473347343800000
  TESTT343434_3347343800001
  ```

  <b>CSV Response:</b>

  ```
  loanId,checkDigit,uli
  BANK1LTEST123451150,Error,Loan ID is not between 21 and 43 characters long
  BANK1LEIFORTEST123458001,26,BANK1LEIFORTEST12345800126
  BANK1LEIFORTEST123458003,20,BANK1LEIFORTEST12345800320
  BANK1LEIFO!TEST123458234,Error,Loan ID is not alphanumeric
  BANK343434733473438000034343473347343800000,79,BANK34343473347343800003434347334734380000079
  TESTT343434_3347343800001,Error,Loan ID is not alphanumeric

  ```

### Single Check Digit Validation

  `POST` request to validate a single check digit.

  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/validate
  Payload: {"uli": "{{ULI}}"}
  ```

  #### Example
  
  <b>Request:</b>

  ```
  curl -X POST 'https://ffiec.cfpb.gov/v2/public/uli/validate' \
  --header 'Content-Type: application/json' \
  --data-raw '{"uli": "EILKZAIZF6TX4HB8ZDX33H54"}'
  ```

  <b>Response:</b>

  ```json
  {
    "isValid": true
  }
  ```

### Batch Check Digit Validation

  `POST` request to batch validate check digits.

  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/validate/csv
  Payload: CSV File as shown below
  ```

  #### Example
  
  <b>Request:</b>

  ```
  curl -X POST \
  "https://ffiec.cfpb.gov/v2/public/uli/validate/csv" \
  -F file=@<PATH>/check_digit_sample_file.csv
  ```
  
  <b>Request Payload:</b>

  ```
  95GVQQ61RS6CWQF0SZD9F4VRXNN1OCVXHP1JURF9ZJS92
  B90YWS6AFX2LGWOXJ1LDNIXOQ6O0000SLR6FSJJ5R89
  ```
  
  <b>CSV Response:</b>

  ```
  uli,isValid
  95GVQQ61RS6CWQF0SZD9F4VRXNN1OCVXHP1JURF9ZJS92,true
  B90YWS6AFX2LGWOXJ1LDNIXOQ6O0000SLR6FSJJ5R89,false
  ```

### Batch Check Digit Validation(Bad Request)

  `POST` request to batch validate check digits.

  ```
  Method: POST
  Endpoint: https://ffiec.cfpb.gov/v2/public/uli/validate/csv
  Payload: CSV File as shown below
  ```

  #### Example
  
  <b>Request:</b>

  ```
  curl -X POST \
  "https://ffiec.cfpb.gov/v2/public/uli/validate/csv" \
  -F file=@<PATH>/check_digit_sample_file.csv
  ```
  
  <b>Request Payload:</b>

  ```
  BANK1LEIF345115014
  BANK1LEIFORTEST12345800126
  BANK1LEIFOR@#EST12345800320
  BANK1LEIFORTEST12345823406
  BANK34343473*4734380000037
  BANK3434347334734380000131BANK3434347334734380000131BANK3434347334734380000131
  ```
  
  <b>CSV Response:</b>

  ```
  uli,isValid
  BANK1LEIF345115014,ULI is not between 23 and 45 characters long
  BANK1LEIFORTEST12345800126,true
  BANK1LEIFOR@#EST12345800320,ULI is not alphanumeric
  BANK1LEIFORTEST12345823406,true
  BANK34343473*4734380000037,ULI is not alphanumeric
  BANK3434347334734380000131BANK3434347334734380000131BANK3434347334734380000131,ULI is not between 23 and 45 characters long  
  ```

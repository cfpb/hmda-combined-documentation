# Rate Spread

### Rate Spread API

The following endpoints allow users to provide loan information and returns the associated ratespread either one at a time in JSON format or in a batch in CSV format.

This API is what powers the [Rate Spread Calculator application](https://ffiec.cfpb.gov/tools/rate-spread).

**Note:** The response is either a number representing the rate spread or "NA".

### Rate Spread Parameters

The following parameters must be provided when using any ratespread API. These are provided in either JSON or CSV format.

Variable | Type | Accepted Values |
|:-------|:-----|:----------------|
|action_taken_type | integer | `1` = Originated<br />`2` = Approved Not Accepted<br />`8` = Pre-approval request approved but not Accepted<br />`3`, `4`, `5`, `6` or `7` will result in `NA` |
|loan_term | integer | Range from `1` - `50`|
|amortization_type | String | `FixedRate` or `VariableRate`|
|apr | double | The annual Percentage Rate on the loan, eg `6.0`|
|lock_in_date | date |  `YYYY-MM-DD`|
|reverse_mortgage | integer | `2` = false<br />`1` = true, will result in `NA`|

### Single Ratespread

  **Request:**

  ```console
  curl -X POST 'https://ffiec.cfpb.gov/public/rateSpread' -H 'Content-Type: application/json' -d '{ "actionTakenType": 1, "loanTerm": 30, "amortizationType": "FixedRate", "apr": 6.0, "lockInDate": "2017-11-20", "reverseMortgage": 2 }'
  ```

  **JSON Response:**
  
  ```json
    { "rateSpread": "2.010" }
  ```

This endpoint accepts loan data in JSON format and returns a JSON object containing the associated ratespread.

`POST https://ffiec.cfpb.gov/public/rateSpread`

The JSON example contains the following parameters:

| Variable | Value |
|:---------|:------|
|actionTakenType | 1 |
|loanTerm | 30 |
|amortizationType | FixedRate |
|apr | 6.0 |
|lockInDate | 2017-11-20 |
|reverseMortgage | 2 |

### Batch Ratespreads

**Request:**

```text
curl -X POST "https://ffiec.cfpb.gov/public/rateSpread/csv" -F file=
```

**CSV Response file with an added column for rate_spread calculated for each row:**

```text
action_taken_type,loan_term,amortization_type,apr,lock_in_date,reverse_mortgage,rate_spread
1,30,FixedRate,6.0,2017-11-20,2,2.010
1,30,VariableRate,6.0,2017-11-20,2,2.150
```

In order to batch caluculate ratespreads the `csv` endpoint can be used. This endpoint accepts a CSV file of ratespread data and returns a CSV file with a new column for the ratespread.

`POST https://ffiec.cfpb.gov/public/rateSpread/csv`

The CSV file example contains the following contents:

|   |    |              |     |            |
|:--|:---|:-------------|:----|:-----------|
| 1 | 30 | FixedRate    | 6.0 | 2017-11-20 |
| 1 | 30 | VariableRate | 6.0 | 2017-11-20 |

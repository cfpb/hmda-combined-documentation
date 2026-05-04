# Data Browser API

The data browser api enables users to interact with subsets of the HMDA data. Given a list of filters on the data that are entered as parameters in the endpoint the APIs will return either an aggregated report of the data in JSON format or a CSV of the raw data.

This API is what powers the [HMDA Data Browser application](https://ffiec.cfpb.gov/data-browser/)

**Note:** depending on the query, queries may take a while to return and data may be too large for conventional spread sheet applications.

## HMDA Data Endpoints

**Nationwide Aggregation Report**
  
  ```GET https://ffiec.cfpb.gov/v2/data-browser-api/view/nationwide/aggregations```
  
  This endpoint is used to generated JSON reports on the entirety of the US. The [year parameter](/api/data-browser/#year-filter) and at least one [HMDA data parameter](/api/data-browser/#hmda-data-filters) are required when calling this endpoint.

**Aggregation Report**

 ```GET https://ffiec.cfpb.gov/v2/data-browser-api/view/aggregations```

  This endpoint is used to generated JSON reports on an LEI and/or geography subset. The [year parameter](/api/data-browser/#year-filter) and at least one [HMDA data parameter](/api/data-browser/#hmda-data-filters) are required when calling this endpoint. Additionally, either one [geographic parameter](/api/data-browser/#geographic-filters) or the [LEI parameter](/api/data-browser/#lei-filter) are required when calling this endpoint. Both a geographic parameter and LEI may be provided.

**Nationwide Data Subset as CSV**

  ```GET https://ffiec.cfpb.gov/v2/data-browser-api/view/nationwide/csv```

  This endpoint is used to download raw HMDA on the entirety of the US, data given the applied filters in csv format. The file will be streamed. The [year parameter](/api/data-browser/#year-filter) and at least one [HMDA data parameter](/api/data-browser/#hmda-data-filters) are required when calling this endpoint.

**Data Subset as CSV**

  ```GET https://ffiec.cfpb.gov/v2/data-browser-api/view/csv```
  
  This endpoint is used to download raw HMDA data given the applied filters in csv format. The file will be streamed. The [year parameter](/api/data-browser/#year-filter) and at least one [HMDA data parameter](/api/data-browser/#hmda-data-filters) are required when calling this endpoint. Additionally, either one [geographic parameter](/api/data-browser/#geographic-filters) or the [LEI parameter](/api/data-browser/#lei-filter) are required when calling this endpoint. Both a geographic parameter and LEI may be provided.

## Filters


### Year Filter

All requests must include a year that defines the filing period of the data.

| Variable Name | Options |
|:--------------|:---------|
|years | 2018, 2019, 2020, 2021, 2022, 2023, 2024|

### LEI Filter

The LEI Filter allows users to filter by specific financial institutions.

| Variable Name | Options |
|:--------------|:---------|
|leis | List of Legal Entity Identifiers|

### Geographic Filters

The HMDA Data Browser requires exactly one geographic filter for all non-nationwide requests.

  Geography | Format
  --- | ---
  msamds | Five Digit MSA/MD Code
  states | Two Letter State Abbreviation (Eg. AL for Alabama)
  counties | Five Digit County FIPS Code

### HMDA Data Filters

HMDA Data requests support the following filters. At least one HMDA date filter is required, multiple options are acceptable.

| Variable Name | Options |
|:--------------|:---------|
|construction_methods | 1,2|
|dwelling_categories | Single Family (1-4 Units):Site-Built<br />Multifamily:Site-Built<br />Single Family (1-4 Units):Manufactured<br />Multifamily:Manufactured|
|ethnicities | Hispanic or Latino<br />Not Hispanic or Latino<br />Joint<br />Ethnicity Not Available<br />Free Form Text Only|
|lien_statuses | 1,2|
|loan_products | Conventional:First Lien<br />FHA:First Lien<br />VA:First Lien<br />FSA/RHS:First Lien<br />Conventional:Subordinate Lien<br />FHA:Subordinate Lien<br />VA:Subordinate Lien<br />FSA/RHS:Subordinate Lien|
|loan_purposes  | 1,2,31,32,4,5|
|loan_types | 1,2,3,4|
|races | Asian<br />Native Hawaiian or Other Pacific Islander<br />Free Form Text Only<br />Race Not Available<br />American Indian or Alaska Native<br />Black or African American<br />2 or more minority races<br />White<br />Joint|
|sexes | Male<br />Female<br />Joint<br />Sex Not Available|
|total_units | 1,2,3,4,5-24,25-49,50-99,100-149,>149|

### Dataset Aggregation

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/data-browser-api/view/aggregations?years={{}}
```

#### Example

 **Request:**

```curl "https://ffiec.cfpb.gov/v2/data-browser-api/view/aggregations?states=MD&years=2018&actions_taken=5,6&races=White,Asian,Joint"```

`GET` JSON with the following parameters

  var | value
  --- | ---
  years | 2018
  states | MD
  actions_taken | 5,6
  races | Asian

**JSON Response:**

```json
  {
    "parameters": {
        "state": "MD",
        "actions_taken": "5,6",
        "races": "Asian"
    },
    "aggregations": [
        {
            "count": 679,
            "sum": 1.90835E8,
            "actions_taken": "5",
            "races": "Asian",
            "state": "MD"
        },
        {
            "count": 716,
            "sum": 2.5435E8,
            "actions_taken": "6",
            "races": "Asian",
            "state": "MD"
        }
    ],
    "servedFrom": "cache"
  }
```

### Dataset CSV Download

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/data-browser-api/view/csv?years={{}}
```

#### Example 

**Request:**

```console
  curl -L "https://ffiec.cfpb.gov/v2/data-browser-api/view/csv?states=CA,MD,DC&years=2018&actions_taken=5"
```

**CSV Response:**
  <img src="/documentation/img/DataBrowserCsvExample.png" className="lang-specific shell" />

## HMDA Filers

`GET https://ffiec.cfpb.gov/v2/data-browser-api/view/filers`

This endpoint can be used to fetch list of financial institutions present in the HMDA dataset. The year parameter is required when calling this endpoint.

### HMDA Filer Parameters

Parameter Name | Options
--- | ---
years | CSV list of years (example: 2018,2019)
states | two letter state code
msamds | 5 digit integer code
counties | 5 digit integer code

### Example

**Request:**

```console
  curl "https://ffiec.cfpb.gov/v2/data-browser-api/view/filers?states=MD,DC&years=2018"
```

**JSON Format Response:**

```json
  {
    "institutions":[
      {
          "lei":"lei",
          "name":"institution name",
          "period":2018
      },
      {
          "lei":"lei",
          "name":"institution name",
          "period":2018
      }
    ]
  }
```

## Errors

Incorrect calls will result in an error. For example the following call will result in an error since there is no state(s)/msamds and years provided.

**Request:**

  ```console
  curl "https://ffiec.cfpb.gov/v2/data-browser-api/view/csv"
```

**JSON Response:**

```json
  {
      "errorType": "provide-atleast-msamds-or-states",
      "message": "Provide year and either states or msamds or both"
  }
```

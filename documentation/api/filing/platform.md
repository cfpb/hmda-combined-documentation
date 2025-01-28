# HMDA Platform Filing API

The following documentation outlines the submission of HMDA data using the Filing API.

This API powers the [HMDA Filing application](https://ffiec.cfpb.gov/filing/)

## Authorization

<p style={{ background: '#ffe4c4', paddingLeft: '10px', paddingTop: '10px', paddingBottom: '10px' }}>
<b><u>Please note:</u></b> Starting on January 1st 2025, for the 2025 HMDA Filling season, all users will be required to authenticate using Login.gov.
</p>

Follow the [Login.gov FAQ](/documentation/faq/login-gov-quick-reference) on creating a new HMDA User account via the HMDA Login.gov UI and go through the process of new user registration.

### Getting a Bearer Token

Since switching over to using only login.gov the bearer token api route has been disabled.

For development purposes, in lieu of directly getting a token from an API call, you can go through the HMDA UI and obtain a Bearer Token via the HMDA User account page.

In the top right of the UI, click your name. It will take you to the Profile page. Scroll to the bottom and hover over the `Developer Settings` and click the `Copy Auth Token` option, it will copy the Bearer Token to your clipboard which can then be used for API calls.

![LoginGov HMDA Auth Token](/img/api/login_gov_token.gif)

In order to more fully integrate with the HMDA Platform your application will need to link to HMDA's authentication server in the same way that HMDA's frontend UI does, changing the redirect uri to link back to your own application.

When accessing keycloak the frontend sends the following request:

```
https://ffiec.cfpb.gov/auth/realms/hmda2/protocol/openid-connect/auth?client_id=hmda2-api&redirect_uri=https%3A%2F%2Fffiec.cfpb.gov%2Ffiling%2F2024%2Finstitutions&state=[[state]]&response_mode=fragment&response_type=code&scope=openid&nonce=[[nonce]]&code_challenge=[[codeChallenge]]code_challenge_method=S256
```

The `redirect_uri` parameter in that request needs to be changed to the uri of your application. For more information on that request you can review the official [OpenId documentation](https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint).

Additionally, you will need to contact hmdahelp@cfpb.gov to have your application added as a valid redirect uri.

As an example of an integration, the HMDA Frontend code can be found [on github](https://github.com/cfpb/hmda-frontend) with the specific section that integrates with keycloak in this [file](https://github.com/cfpb/hmda-frontend/blob/757ab4c1f542fce810de5dd4aaa4b27532a5ccbc/src/common/api/Keycloak.js). If you are running that code yourself, in order to have it reach out the HMDA authentication service you would change [this value](https://github.com/cfpb/hmda-frontend/blob/master/public/keycloak.json#L3) to `http://ffiec.cfpb.gov/auth`.

## Postman Collection

The [HMDA Postman Collection](https://github.com/cfpb/hmda-platform/tree/master/newman/postman) has been prepared to simplify the process of using the HMDA Platform Filing APIs.

[Postman](https://www.postman.com/product/api-client/) is a client side application that allows users to easily construct API calls and import external API collections.

## Filing Process

Submission of a HMDA file flows in the following steps which are mirrored in the Submission status codes:

1. Create a Filing: There is one Filing per institution, per filing season. This Filing is created by the HMDA Operations team in preperation for each filing season.
1. Create a Submission: Submissions are created within a Filing, each representing a single file upload. Many Submissions can be created for a Filing. Each new Submission is assigned a sequentially incremented ID.
1. Upload a File: A file is then uploaded to the Submission that was created. Only one file can be uploaded per Submission. To upload a new file you must create a new Submission.
1. Check the status of the Submission: If a Submission triggers Syntactical or Validity Edits, a corrected file must be uploaded.
1. Validate Quality Edits: Review any Quality Edits that have been triggered and confirm that the submitted data are correct.
1. Validate Macro Edits: Review any Macro Edits that have been triggered and confirm that the submitted data are correct.
1. Sign the Submission: Perform final review of the data and complete the HMDA filing.

### Object Hierarchy

![filing heirarchy](/img/filingObjectHierarchy.png)

### Submission Status

The Submission status is the best way to check the state of a Filing. It will be useful to query the Submission status often throughout the process of file upload and Edit validation.

<b>JSON Response:</b>

```json
{
  "id": {
    "lei": "12345abc",
    "period": "2020",
    "sequenceNumber": 3
  },
  "status": {
    "code": 1,
    "message": "No data has been uploaded yet.",
    "description": "The filing period is open and available to accept HMDA data. Make sure your data is in a pipe-delimited text file."
  },
  "start": 0,
  "end": 0,
  "fileName": "test.txt",
  "receipt": ""
}
```

#### Submission Status Codes

In order to track the status of a Filing for a financial institution, the following states are captured by the HMDA Platform:

Code | Message | Description
--- | --- | ---
1 | No data has been uploaded yet. | The filing period is open and available to accept HMDA data. Make sure your data is in a pipe-delimited text file.
2 | Your file is uploading. | Your file is currently being uploaded to the HMDA Platform.
3 | Your file has been uploaded. | Your data is ready to be analyzed.
4 | Checking the formatting of your data. | Your file is being analyzed to ensure that it meets formatting requirements specified in the HMDA Filing Instructions Guide.
5 | Your data has formatting errors. | Review these errors and update your file. Then, upload the corrected file.
6 | Your data is formatted correctly. | Your file meets the formatting requirements specified in the HMDA Filing Instructions Guide. Your data will now be analyzed for any edits.
7 | Your data is being analyzed. | Your data has been uploaded and is being checked for any edits.
8 | Your data has been analyzed for Syntactical and Validity Errors. | Your file has been analyzed and does not contain any Syntactical or Validity errors.
9 | Your data has syntactical and/or validity edits that need to be reviewed. | Your file has been uploaded, but the filing process may not proceed until the file is corrected and re-uploaded.
10 | Your data has been analyzed for Quality Errors. | Your file has been analyzed, and does not contain quality errors.
11 | Your data has quality edits that need to be reviewed. | Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded.
12 | Your data has been analyzed for macro errors. | Your file has been analyzed, and does not contain macro errors.
13 | Your data has macro edits that need to be reviewed. | Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded.
14 | Your data is ready for submission. | Your financial institution has certified that the data is correct, but it has not been submitted yet.
15 | Your submission has been accepted. | This completes your HMDA filing process for this year. If you need to upload a new HMDA file, the previously completed filing will not be overridden until all edits have been cleared and verified, and the new file has been submitted.
-1 | An error occurred while submitting the data. | Please re-upload your file.

## Endpoints

### Start a Filing

For every filing period, you must begin by starting a Filing. This only needs to be done once per filing season. On the official HMDA Platform this Filing will have already been created by the HMDA Operations team.
The `POST` will result in a `200` only for the first time it's called. If the filing for the given filing period already exists, the `POST` will return a `400`.

```
Method: POST
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}
Headers: Authorization: Bearer {{access_token}}
```
#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/2020" \
  -H 'Authorization: Bearer  {{access_token}}' \
```

<b>Response:</b>

```json
{
    "filing": {
        "period": "2020",
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "status": {
            "code": 2,
            "message": "in-progress"
        },
        "filingRequired": true,
        "start": 1572378187454,
        "end": 0
    },
    "submissions": []
}
```

### Get a Filing

This endpoint can be used to confirm that a Filing exists for the relevant period.

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}" \
  -H 'Authorization: Bearer  {{access_token}}' \
```

<b>Response:</b>

```json
{
    "filing": {
        "period": "2020",
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "status": {
            "code": 2,
            "message": "in-progress"
        },
        "filingRequired": true,
        "start": 1572378187454,
        "end": 0
    },
    "submissions": []
}
```

### Create a Submission

A Submission must be created for each file upload. More than one Submission can be created for a filing period. The most recent Submission will be considered the Latest Submission. Each `POST` on the Submission endpoint will return a new Submission `sequenceNumber`.

```
Method: POST
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions
Headers: {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions" \
  -H 'Authorization: Bearer {{access_token}}' \
``````

<b>Response:</b>


```json
{
    "id": {
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "period": "2020",
        "sequenceNumber": 10
    },
    "status": {
        "code": 1,
        "message": "No data has been uploaded yet.",
        "description": "The filing period is open and available to accept HMDA data. Make sure your data is in a pipe-delimited text file."
    },
    "start": 1572358820303,
    "end": 0,
    "fileName": "",
    "receipt": ""
}
```

### Get the Latest Submission

Returns details about the last created Submission including its sequence number and status.

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/latest
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/latest" \
  -H 'Authorization: Bearer {{access_token}}' \
```

<b>Response:</b>

```json
{
    "id": {
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "period": "2020",
        "sequenceNumber": 10
    },
    "status": {
        "code": 13,
        "message": "Your data has macro edits that need to be reviewed.",
        "description": "Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded."
    },
    "start": 1572372016130,
    "end": 0,
    "fileName": "clean_file_10.txt",
    "receipt": "",
    "qualityVerified": false,
    "macroVerified": false,
    "qualityExists": true,
    "macroExists": true
}
```

### Upload a File

Upload a file to a Submission.

```
Method: POST
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}
Headers: Authorization: Bearer {{access_token}}, 'Content-Type': multipart/form-data
Payload: LAR file
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/10" \
  -H 'Authorization: Bearer {{access_token}}' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F file=<file.csv>
```

<b>Response:</b>

```json
{
    "id": {
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "period": "2020",
        "sequenceNumber": 10
    },
    "status":{
        "code": 3,
        "message": "Your file has been uploaded.",
        "description": "Your data is ready to be analyzed."
    },
    "start": 1572372016130,
    "end": 0,
    "fileName": "",
    "receipt": ""
}
```

### View Parsing Errors

Returns a list of all parsing errors triggered by the file uploaded to a Submission.

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/parseErrors
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/10/parseErrors" \
  -H 'Authorization: Bearer {{access_token}}'
```

<b>Response</b>

```json
{
    "transmittalSheetErrors": [],
    "larErrors": [],
    "count": 0,
    "total": 0,
    "status": {
        "code": 5,
        "message": "Your data has formatting errors.",
        "description": "Review these errors and update your file. Then, upload the corrected file."
    },
    "_links": {
        "href": "/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/24/parseErrors{rel}",
        "self": "?page=1",
        "first": "?page=1",
        "prev": "?page=1",
        "next": "?page=0",
        "last": "?page=0"
    }
}
```

### View All Edits

Returns a summary of all Edits triggered by an upload in a Submission.

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/edits
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/24/edits" \
  -H 'Authorization: Bearer {{access_token}}'
```

<b>Response:</b>

```json
{
    "syntactical": {
        "edits": []
    },
    "validity": {
        "edits": []
    },
    "quality": {
        "edits": [
            {
                "edit": "Q630",
                "description": "If Total Units is greater than or equal to 5, then HOEPA Status generally should equal 3."
            },
            {
                "edit": "Q631",
                "description": "If Loan Type equals 2, 3 or 4, then Total Units generally should be less than or equal to 4."
            }
        ],
        "verified": false
    },
    "macro": {
        "edits": [
            {
                "edit": "Q637",
                "description": "No more than 15% of the loans in the file should report Action Taken equals 5. Your data indicates a percentage outside of this range."
            }
        ],
        "verified": false
    },
    "status": {
        "code": 13,
        "message": "Your data has macro edits that need to be reviewed.",
        "description": "Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded.",
        "qualityVerified": false,
        "macroVerified": false
    }
}
```

### View Edit Details

Returns detailed information about a specific Edit, including a list of lines that triggered the Edit and the relevant fields from those lines.


```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/edits/{{edit_code}}
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/24/edits/Q631" \
  -H 'Authorization: Bearer {{access_token}}'
```

<b>Response:</b>

```json
{
    "edit": "Q631",
    "rows": [
        {
           "id": "B90YWS6AFX2LGWOXJ1LDHHXWCDPM0ZEHW08FFTXGRXT62",
           "fields": [
               {
                   "name": "Loan Type",
                   "value": "3"
               },
               {
                   "name": "Total Units",
                   "value": "16"
               }
           ]
       }
   ],
   "count": 20,
   "total": 54,
   "_links": {
       "href": "/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/24/edits/Q631{rel}",
       "self": "?page=1",
       "first": "?page=1",
       "prev": "?page=1",
       "next": "?page=2",
       "last": "?page=3"
   }
}
```

### Verify Quality Edits

Verify that the uploaded data is correct and that the reported Quality Edits are not relevent to the Submission.

```
Method: POST
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/edits/quality
Headers: Authorization: Bearer {{access_token}}
Body: {"verified": true}
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/{{sequenceNumber}}/edits/quality" \
  -H 'Authorization: Bearer {{access_token}}' \
  -d '{"verified": true}'
```

<b>Response:</b>

```json
{
    "verified": true,
    "status": {
        "code": 13,
        "message": "Your data has macro edits that need to be reviewed.",
        "description": "Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded."
    }
}
```

### Verify Macro Edits

Verify that the uploaded data is correct and that the reported Macro Edits are not relevent to the Submission.

```
Method: POST
Endpoint | https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/edits/macro
Headers: Authorization: Bearer {{access_token}}
Body: {"verified": true/false}
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/{{sequenceNumber}}/edits/macro" \
  -H 'Authorization: Bearer {{access_token}}' \
  -d '{"verified": true}'
```

<b>Response:</b>


```json
{
    "verified": true,
    "status": {
        "code": 14,
        "message": "Your data is ready for submission.",
        "description": "Your financial institution has certified that the data is correct, but it has not been submitted yet."
    }
}
```

### Sign a Submission

Sign and complete a HMDA Submission.

```
Method: POST
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/sign
Headers: Authorization: Bearer {{access_token}}
Body: {"signed": true/false}
```

#### Example

<b>Request:</b>

```
curl -X POST \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/{{sequenceNumber}}/sign" \
  -H 'Authorization: Bearer {{access_token}}' \
  -d '{"signed": true}'
```

<b>Response:</b>


```json
{
    "email": "user@bank.com",
    "timestamp": 1572375004080,
    "receipt": "B90YWS6AFX2LGWOXJ1LD-{{year}}-10-1572375004080",
    "status": {
        "code": 15,
        "message": "Your submission has been accepted.",
        "description": "This completes your HMDA filing process for this year. If you need to upload a new HMDA file, the previously completed filing will not be overridden until all edits have been cleared and verified, and the new file has been submitted."
    }
}
```

Sign and complete a HMDA Submission.

### Get Sign receipt

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/{{year}}/submissions/{{sequenceNumber}}/sign
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/{{sequenceNumber}}/sign" \
  -H 'Authorization: Bearer {{access_token}}'
```
<b>Response:</b>

```json
{
    "email": "user@bank.com",
    "timestamp": 1572375004080,
    "receipt": "B90YWS6AFX2LGWOXJ1LD-{{year}}-55-1572375004080",
    "status": {
        "code": 15,
        "message": "Your submission has been accepted.",
        "description": "This completes your HMDA filing process for this year. If you need to upload a new HMDA file, the previously completed filing will not be overridden until all edits have been cleared and verified, and the new file has been submitted."
    }
}
```

### Get Submission Summary

```
Method: GET
Endpoint: https://ffiec.cfpb.gov/v2/filing/v2/filing/institutions/{{lei}}/filings/{{year}}/submissions/{{sequenceNumber}}/summary
Headers: Authorization: Bearer {{access_token}}
```

#### Example

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/submissions/{{sequenceNumber}}/summary'" \
  -H 'Authorization: Bearer {{access_token}}'
```

<b>Response:</b>

```json
{
    "submission": {
        "id": {
            "lei": "B90YWS6AFX2LGWOXJ1LD",
            "period": {
                "year": "2020"
                "quarter": null
            },
            "sequenceNumber": 20
        },
        "status": {
            "code": 15,
            "message": "Your submission has been accepted.",
            "description": "This completes your HMDA filing process for this year. If you need to upload a new HMDA file, the previously completed filing will not be overridden until all edits have been cleared and verified, and the new file has been submitted."
        },
        "start": 1634228617589,
        "end": 1634229085705,
        "fileName": "clean_file_5_rows_Bank0_2020.txt",
        "receipt": "B90YWS6AFX2LGWOXJ1LD-2020-26-1634229085705",
        "signerUsername": "user@bank.com"
    },
    "ts": {
        "id": 1,
        "institutionName": "Bank0",
        "year": "2020"
        "quarter": 4,
        "contact": {
            "name": "Mr. Smug Pockets",
            "phone": "555-555-5555",
            "email": "user@bank.com",
            "address": {
                "street": "1234 Hocus Potato Way",
                "city": "Tatertown",
                "state": "UT",
                "zipCode": "84096"
            }
        },
        "agency": 9,
        "totalLines": 5,
        "taxId": "01-0123456",
        "LEI": "B90YWS6AFX2LGWOXJ1LD"
    }
}
```

## Quarterly Filing

All the endpoints are the same for quarterly filing with the addtion of `quarter/Q1/`, `quarter/Q2/` or `quarter/Q3/` after the filing parameter and before the submission parameter.

<b>Request:</b>

```
curl -X GET \
  "https://ffiec.cfpb.gov/v2/filing/institutions/B90YWS6AFX2LGWOXJ1LD/filings/{{year}}/quarter/Q1/submissions/latest" \
  -H 'Authorization: Bearer {{access_token}}' \
```

<b>Response:</b>

```json
{
    "id": {
        "lei": "B90YWS6AFX2LGWOXJ1LD",
        "period": {
            "year": "2020"
            "quarter": "Q1"
        },
        "sequenceNumber": 10
    },
    "status": {
        "code": 13,
        "message": "Your data has macro edits that need to be reviewed.",
        "description": "Your file has been uploaded, but the filing process may not proceed until edits are verified or the file is corrected and re-uploaded."
    },
    "start": 1585750668652,
    "end": 0,
    "fileName": "<file_name>",
    "receipt": "",
    "qualityVerified": false,
    "macroVerified": false,
    "qualityExists": true,
    "macroExists": false
}
```
/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const requestFactory = require('../lib/requestwrapper');
const pick = require('object.pick');
const util = require('util');
const BaseService = require('../lib/base_service');

/**
 *
 * @param options
 * @param options.version_date
 * @constructor
 */
function ConversationV1(options) {
  BaseService.call(this, options);

  // Check if 'version_date' was provided
  if (typeof this._options.version_date === 'undefined') {
    throw new Error('Argument error: version_date was not specified, use ConversationV1.VERSION_DATE_2017_02_03');
  }
  this._options.qs.version = options.version_date;
}
util.inherits(ConversationV1, BaseService);
ConversationV1.prototype.name = 'conversation';
ConversationV1.prototype.version = 'v1';
ConversationV1.URL = 'https://gateway.watsonplatform.net/conversation/api';

/**
 * Initial release
 * @type {string}
 */
ConversationV1.VERSION_DATE_2016_07_11 = '2016-07-11';

/**
 * 9/20 update made changes to response format
 *
 * * context.system.dialog_stack changed from an array of strings to an array of objects
 *
 * Old:
```json
 "context": {
    "system": {
      "dialog_stack": [
        "root"
      ],
```
 * New:
```json
 "context": {
    "system": {
      "dialog_stack": [
        {
          "dialog_node": "root"
        }
      ],
```
 *
 * @see https://console.bluemix.net/docs/services/conversation/release-notes.html#20September2016
 * @type {string}
 */
ConversationV1.VERSION_DATE_2016_09_20 = '2016-09-20';

/**
 * 02/03 Update
 *
 * * Absolute scoring has now been enabled.
 * @see https://console.bluemix.net/docs/services/conversation/intents.html#absolute-scoring
 *
 * Old:
 ```json
 "intents": [
   { "intent" : "turn_off", "confidence" : 0.54 },
   { "intent" : "locate_amenity", "confidence" : 0.4},
   { "intent" : "weather", "confidence" : 0.06}
 ]
```
 * Previously all intent confidence values summed to 1.0.
 * New:
```json
 "intents": [
   { "intent" : "turn_off", "confidence" : 0.54 },
   { "intent" : "locate_amenity", "confidence" : 0.52},
   { "intent" : "weather", "confidence" : 0.01}
 ]
```
 * Now each intent is scored individually with a maximum confidence value of 1.
 *
 * * Irrelevant input detection.
 * Previously an intent was always returned regardless of whether the system considered it irrelevant to the
 * training data within the workspace. With Irrelevant input detection the system will now return an empty intent
 * array if the system thinks the input is irrelevant to the workspace content.
 * Old:
 ```json
 "input" : { "text" : "what color is the sky?"},
 "intents": [
 { "intent" : "weather", "confidence" : 0.36 },
 { "intent" : "turn_off", "confidence" : 0.33},
 { "intent" : "locate_amenity", "confidence" : 0.31}
 ]
 ```
 * New:
 ```json
 "input" : { "text" : "what color is the sky?"},
 "intents": []
 ```
 *
 * @see https://console.bluemix.net/docs/services/conversation/release-notes.html#3February2017
 * @type {string}
 */
ConversationV1.VERSION_DATE_2017_02_03 = '2017-02-03';

/**
 * Method: message
 *
 * Returns a response to a user utterance.
 *
 * Example response for 2017-02-03 version_date:
```json
 {
   "intents": [
     {
       "intent": "turn_on",
       "confidence": 0.999103316650195
     }
   ],
   "entities": [
     {
       "entity": "appliance",
       "location": [
         12,
         18
       ],
       "value": "light"
     }
   ],
   "input": {
     "text": "Turn on the lights"
   },
   "output": {
     "log_messages": [],
     "text": [
       "Hi. It looks like a nice drive today. What would you like me to do?"
     ],
     "nodes_visited": [
       "node_1_1467221909631"
     ]
   },
   "context": {
     "conversation_id": "820334ac-ee79-45b5-aa03-7958dcd0fd34",
     "system": {
       "dialog_stack": [
         {
           "dialog_node": "root"
         }
       ],
       "dialog_turn_counter": 1,
       "dialog_request_counter": 1
     }
   }
 }
```
 *
 *
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param [params.input]
 * @param [params.context]
 * @param [params.alternate_intents=false] - includes other lower-confidence intents in the intents array.
 * @param [params.output]
 * @param [params.entities]
 * @param [params.intents]
 *
 */
ConversationV1.prototype.message = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}/message',
      method: 'POST',
      json: true,
      body: pick(params, ['input', 'context', 'alternate_intents', 'output', 'entities', 'intents']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: listWorkspaces
 *
 * Returns the list of workspaces in Watson Conversation Service instance
 *
 * Example Response:
```json
 {
   "workspaces": [
     {
       "name": "Pizza app",
       "created": "2015-12-06T23:53:59.153Z",
       "language": "en",
       "metadata": {},
       "updated": "2015-12-06T23:53:59.153Z",
       "description": "Pizza app",
       "workspace_id": "pizza_app-e0f3"
     }
   ]
 }
```
 *
 * @param {Object} [params]
 * @param {Function} [callback]
 */
ConversationV1.prototype.listWorkspaces = function(params, callback) {
  if (typeof params === 'function' && !callback) {
    callback = params;
    params = null;
  }
  const parameters = {
    options: {
      url: '/v1/workspaces',
      method: 'GET'
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: createWorkspace
 *
 * Creates a new workspace
 *
 * Model Schema
```json
 {
  "name": "string",
  "description": "string",
  "language": "string",
  "metadata": {},
  "counterexamples": [
    {
      "text": "string"
    }
  ],
  "dialog_nodes": [
    {
      "dialog_node": "string",
      "description": "string",
      "conditions": "string",
      "parent": "string",
      "previous_sibling": "string",
      "output": {
        "text": "string"
      },
      "context": {},
      "metadata": {},
      "go_to": {
        "dialog_node": "string",
        "selector": "string",
        "return": true
      }
    }
  ],
  "entities": [
    {
      "entity": "string",
      "description": {
        "long": [
          "string"
        ],
        "short": [
          "string"
        ],
        "examples": [
          "string"
        ]
      },
      "type": "string",
      "source": "string",
      "open_list": false,
      "values": [
        {
          "value": "string",
          "metadata": {},
          "synonyms": [
            "string"
          ]
        }
      ]
    }
  ],
  "intents": [
    {
      "intent": "string",
      "description": "string",
      "examples": [
        {
          "text": "string"
        }
      ]
    }
  ]
 }
```
 *
 * Example Response
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}  params
 * @param {String} [params.name]
 * @param {String} [params.description]
 * @param {String} [params.language]
 * @param {Object} [params.metadata]
 * @param {Array<Object>} [params.entities]
 * @param {Array<Object>} [params.intents]
 * @param {Array<Object>} [params.dialog_nodes]
 * @param {Array<Object>} [params.counterexamples]
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.createWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces',
      method: 'POST',
      json: true,
      body: pick(params, ['name', 'language', 'entities', 'intents', 'dialog_nodes', 'metadata', 'description', 'counterexamples'])
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: getWorkspace
 *
 * Returns information about a specified workspace or return the whole workspace
 *
 * Example Response (with default export value):
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param [params.export=false] - if true, the full contents of all of the sub-resources are returned
 * @param {Function} [callback]
 */

ConversationV1.prototype.getWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'GET',
      json: true,
      qs: pick(params, ['export']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: deleteWorkspace
 *
 * Deletes the specified workspace
 *
 *
 * @param  {Object}   params   { workspace_id: '' }
 * @param params.workspace_id
 * @param {Function} [callback]
 */

ConversationV1.prototype.deleteWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'DELETE',
      json: true,
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: updateWorkspace
 *
 * Updates a workspace
 *
 * Example value
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3",
  "counterexamples": [
    {
      "text": "string"
    }
  ],
  "dialog_nodes": [
    {
      "dialog_node": "string",
      "description": "string",
      "conditions": "string",
      "parent": "string",
      "previous_sibling": "string",
      "output": {
        "text": "string"
      },
      "context": {},
      "metadata": {},
      "go_to": {
        "dialog_node": "string",
        "selector": "string",
        "return": true
      }
    }
  ],
  "entities": [
    {
      "entity": "string",
      "description": {
        "long": [
          "string"
        ],
        "short": [
          "string"
        ],
        "examples": [
          "string"
        ]
      },
      "type": "string",
      "source": "string",
      "open_list": false,
      "values": [
        {
          "value": "string",
          "metadata": {},
          "synonyms": [
            "string"
          ]
        }
      ]
    }
  ],
  "intents": [
    {
      "intent": "string",
      "description": "string",
      "examples": [
        {
          "text": "string"
        }
      ]
    }
  ]
 }
```
 *
 * Example Response:
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param {String} params.workspace_id
 * @param {String} [params.name]
 * @param {String} [params.description]
 * @param {String} [params.language]
 * @param {Object} [params.metadata]
 * @param {Array<Object>} [params.entities]
 * @param {Array<Object>} [params.intents]
 * @param {Array<Object>} [params.dialog_nodes]
 * @param {Array<Object>} [params.counterexamples]
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.updateWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'POST',
      json: true,
      body: pick(params, ['name', 'language', 'entities', 'intents', 'dialog_nodes', 'metadata', 'description', 'counterexamples']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: workspaceStatus
 *
 * Returns the training status of the specified workspace
 *
 * Example Response:
```json
 {
  "workspace_id": "pizza_app-e0f3",
  "training": "true"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.workspaceStatus = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}/status',
      method: 'GET',
      json: true,
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

module.exports = ConversationV1;

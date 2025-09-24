# Supabase Logger

A Node.js library for logging traces to a Supabase database.

## Installation

```bash
npm install supabase-logger
```

## Usage

### Initialization

First, you need to initialize the library with your Supabase URL and key. You can also provide optional `companyId`, `service`, and `namespace` values.

```javascript
const logger = require('supabase-logger');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

const options = {
  companyId: 'YOUR_COMPANY_ID',
  service: 'YOUR_SERVICE_NAME',
  namespace: 'YOUR_NAMESPACE'
};

logger.initialize(supabaseUrl, supabaseKey, options);
```

### Logging Levels

The library provides the following logging levels:

* `LogLevel.ERROR` (0)
* `LogLevel.LOG` (1)
* `LogLevel.INFO` (2)
* `LogLevel.DEBUG` (3)

### Tracing Methods

Each tracing method now returns a `correlationId` which can be used to link related traces.

#### `trace(level, message, data, correlationId)`

This is the base method for logging a trace. You can use it to log a trace with a custom level. If no `correlationId` is provided, a new one will be generated.

```javascript
const correlationId = logger.trace(logger.LogLevel.INFO, 'This is an informational message', { customData: 'some value' });
```

#### `traceError(message, data, correlationId)`

Logs an error trace.

```javascript
logger.traceError('This is an error message', { error: new Error('Something went wrong') });
```

#### `traceLog(message, data, correlationId)`

Logs a general log trace.

```javascript
logger.traceLog('This is a log message', { details: 'some details' });
```

#### `traceInfo(message, data, correlationId)`

Logs an informational trace.

```javascript
logger.traceInfo('This is an info message', { info: 'some info' });
```

#### `traceDebug(message, data, correlationId)`

Logs a debug trace.

```javascript
logger.traceDebug('This is a debug message', { debugData: 'some debug data' });
```

#### `traceMethod(methodName, input, output, correlationId)`

Traces the entry and exit of a method. It will automatically create a `correlationId` if one is not provided, and use the same ID for both the entry and exit trace.

```javascript
logger.traceMethod('myMethod', { arg1: 'value1' }, { result: 'some result' });
```

#### `traceDatabaseCall(query, result, correlationId)`

Traces a database call.

```javascript
logger.traceDatabaseCall('SELECT * FROM users', { rowCount: 10 });
```

## Supabase Setup

You need to create a table named `auditoria` in your Supabase database with the following columns:

* `id` (int8, primary key, auto-incrementing)
* `created_at` (timestamptz, default: `now()`)
* `level` (int2)
* `message` (text)
* `data` (jsonb)
* `company_id` (text)
* `service` (text)
* `namespace` (text)
* `correlation_id` (uuid)

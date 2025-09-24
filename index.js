const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const LogLevel = {
  ERROR: 0,
  LOG: 1,
  INFO: 2,
  DEBUG: 3,
};

let supabase;
let companyId;
let service;
let namespace;

function initialize(supabaseUrl, supabaseKey, options = {}) {
  supabase = createClient(supabaseUrl, supabaseKey);
  companyId = options.companyId;
  service = options.service;
  namespace = options.namespace;
}

async function trace(level, message, data, correlationId = uuidv4()) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please call initialize() first.');
  }

  const logData = {
    level,
    message,
    data,
    company_id: companyId,
    service,
    namespace,
    correlation_id: correlationId,
  };

  const { error } = await supabase.from('auditoria').insert([logData]);

  if (error) {
    console.error('Error logging to Supabase:', error);
  }
  return correlationId;
}

async function traceError(message, data, correlationId) {
  return trace(LogLevel.ERROR, message, data, correlationId);
}

async function traceLog(message, data, correlationId) {
  return trace(LogLevel.LOG, message, data, correlationId);
}

async function traceInfo(message, data, correlationId) {
  return trace(LogLevel.INFO, message, data, correlationId);
}

async function traceDebug(message, data, correlationId) {
  return trace(LogLevel.DEBUG, message, data, correlationId);
}

async function traceMethod(methodName, input, output, correlationId) {
    const fullMethodName = namespace ? `${namespace}.${methodName}` : methodName;
    const entryMessage = `Entering method ${fullMethodName}`;
    const exitMessage = `Exiting method ${fullMethodName}`;

    const currentCorrelationId = correlationId || uuidv4();

    await traceInfo(entryMessage, { input }, currentCorrelationId);
    await traceInfo(exitMessage, { output }, currentCorrelationId);
    return currentCorrelationId;
}

async function traceDatabaseCall(query, result, correlationId) {
    return await traceDebug(`Database call: ${query}`, { result }, correlationId);
}

module.exports = {
  initialize,
  LogLevel,
  trace,
  traceError,
  traceLog,
  traceInfo,
  traceDebug,
  traceMethod,
  traceDatabaseCall
};
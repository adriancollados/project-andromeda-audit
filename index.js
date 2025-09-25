const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const LogLevel = {
  ERROR: 0,
  LOG: 1,
  INFO: 2,
  DEBUG: 3,
};

let supabase;
let defaultCompanyId;
let defaultService;
let defaultNamespace;

function initialize(supabaseUrl, supabaseKey, options = {}) {
  supabase = createClient(supabaseUrl, supabaseKey);
  defaultCompanyId = options.companyId;
  defaultService = options.service;
  defaultNamespace = options.namespace;
}

async function log(logOptions) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please call initialize() first.');
  }

  const { 
    level, 
    message, 
    data, 
    companyId = defaultCompanyId, 
    service = defaultService, 
    namespace = defaultNamespace, 
    correlationId = uuidv4()
  } = logOptions;

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

module.exports = {
  initialize,
  LogLevel,
  log,
};
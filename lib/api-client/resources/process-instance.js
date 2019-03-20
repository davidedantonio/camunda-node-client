'use strict';

var AbstractClientResource = require('./../abstract-client-resource');
var utils = require('../../utils');
var Q = require('q');
/**
 * No-Op callback
 */
function noop() {}

/**
 * Process Instance Resource
 *
 * @class
 * @memberof CamSDK.client.resource
 * @augments CamSDK.client.AbstractClientResource
 */
var ProcessInstance = AbstractClientResource.extend(
/** @lends  CamSDK.client.resource.ProcessInstance.prototype */
  {

  },

/** @lends  CamSDK.client.resource.ProcessInstance */
  {
  /**
   * API path for the process instance resource
   */
    path: 'process-instance',

  /**
   * Retrieve a single process instance
   *
   * @param  {uuid}     id    of the process instance to be requested
   * @param  {Function} done
   */
    get: function(id, done) {
      done = done || noop;
      var deferred = Q.defer();

      this.http.get(this.path +'/'+ id, {
        done: function(err, data) {
          if (err) {
            done(err);
            return deferred.reject(err);
          }

          done(null, data);
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    },

    /**
    * Query for historic instances that fulfill the given parameters.
    *
    * @param  {Object}   [params]
    * @param  {uuid[]}   [params.processInstanceIds]
    * @param  {String}   [params.businessKey]
    * @param  {String}   [params.businessKeyLike]
    * @param  {uuid}     [params.caseInstanceId]
    * @param  {uuid}     [params.processDefinitionId]
    * @param  {String}   [params.processDefinitionKey]
    * @param  {uuid}     [params.deploymentId]
    * @param  {uuid}     [params.superProcessInstance]
    * @param  {uuid}     [params.subProcessInstance]
    * @param  {uuid}     [params.superCaseInstance]
    * @param  {uuid}     [params.subCaseInstance]
    * @param  {Boolean}  [params.active]
    * @param  {Boolean}  [params.suspended]
    * @param  {uuid}     [params.incidentId]
    * @param  {String}   [params.incidentType]
    * @param  {Number}   [params.firstResult]
    * @param  {Number}   [params.maxResults]
    * @param  {String}   [params.incidentMessage]
    * @param  {String}   [params.incidentMessageLike]
    * @param  {String}   [params.tenantIdIn]
    * @param  {String}   [params.withoutTenantId]
    * @param  {String}   [params.activityIdIn]
    * @param  {Object[]} [params.variables]
    * @param  {Function} done
    */
    post: function (params, done) {
      if (typeof params === 'function') {
        done = arguments[0];
        params = {};
      }

      var body = {};
      var query = {};
      var queryParams = ['firstResult', 'maxResults'];

      for (var p in params) {
        if (queryParams.indexOf(p) > -1) {
          query[p] = params[p];
        }
        else {
          body[p] = params[p];
        }
      }

      return this.http.post(this.path, {
        data: body,
        query: query,
        done: done
      });
    },

  /**
   * Creates a process instance from a process definition
   *
   * @param  {Object}   params
   * @param  {String}   [params.id]
   * @param  {String}   [params.key]
   * @param  {Object.<String, *>} [params.variables]
   * @param  {requestCallback} [done]
   */
    create: function(params, done) {
      return this.http.post(params, done);
    },

    list: function(params, done) {
      var path = this.path;

      return this.http.get(path, {
        data: params,
        done: done
      });
    },

    count: function(params, done) {
      var path = this.path + '/count';

      return this.http.get(path, {
        data: params,
        done: done
      });
    },

  /**
   * Post process instance modifications
   * @see http://docs.camunda.org/api-references/rest/#process-instance-modify-process-instance-execution-state-method
   *
   * @param  {Object}           params
   * @param  {UUID}             params.id                     process instance UUID
   *
   * @param  {Array}            params.instructions           Array of instructions
   *
   * @param  {Boolean}          [params.skipCustomListeners]  Skip execution listener invocation for
   *                                                          activities that are started or ended
   *                                                          as part of this request.
   *
   * @param  {Boolean}          [params.skipIoMappings]       Skip execution of input/output
   *                                                          variable mappings for activities that
   *                                                          are started or ended as part of
   *                                                          this request.
   *
   * @param  {requestCallback}  done
   */
    modify: function(params, done) {
      return this.http.post(this.path + '/' + params.id + '/modification', {
        data: {
          instructions:         params.instructions,
          skipCustomListeners:  params.skipCustomListeners,
          skipIoMappings:       params.skipIoMappings
        },
        done: done
      });
    },

    modifyAsync: function(params, done) {
      return this.http.post(this.path + '/' + params.id + '/modification-async', {
        data: {
          instructions:         params.instructions,
          skipCustomListeners:  params.skipCustomListeners,
          skipIoMappings:       params.skipIoMappings
        },
        done: done
      });
    },

    /**
     * Delete multiple process instances asynchronously (batch).
     *
     * @see https://docs.camunda.org/manual/latest/reference/rest/process-instance/post-delete/
     *
     * @param   {Object}            payload
     * @param   {requestCallback}   done
     *
     */
    deleteAsync: function(payload, done) {
      return this.http.post(this.path + '/delete', {
        data: payload,
        done: done
      });
    },

    /**
     * Delete a set of process instances asynchronously (batch) based on a historic process instance query.
     *
     * @see https://docs.camunda.org/manual/latest/reference/rest/process-instance/post-delete-historic-query-based/
     *
     * @param   {Object}            payload
     * @param   {requestCallback}   done
     *
     */
    deleteAsyncHistoricQueryBased: function(payload, done) {
      return this.http.post(this.path + '/delete-historic-query-based', {
        data: payload,
        done: done
      });
    },

    /**
     * Set retries of jobs belonging to process instances asynchronously (batch).
     *
     * @see https://docs.camunda.org/manual/latest/reference/rest/process-instance/post-set-job-retries
     *
     * @param   {Object}            payload
     * @param   {requestCallback}   done
     *
     */
    setJobsRetriesAsync: function(payload, done) {
      return this.http.post(this.path + '/job-retries', {
        data: payload,
        done: done
      });
    },

    /**
     * Create a batch to set retries of jobs asynchronously based on a historic process instance query.
     *
     * @see https://docs.camunda.org/manual/latest/reference/rest/process-instance/post-set-job-retries-historic-query-based
     *
     * @param   {Object}            payload
     * @param   {requestCallback}   done
     *
     */
    setJobsRetriesAsyncHistoricQueryBased: function(payload, done) {
      return this.http.post(this.path + '/job-retries-historic-query-based', {
        data: payload,
        done: done
      });
    },

    /**
     * Activates or suspends process instances asynchronously with a list of process instance ids, a process instance query, and/or a historical process instance query
     *
     * @see https://docs.camunda.org/manual/latest/reference/rest/process-instance/post-activate-suspend-in-batch/
     *
     * @param   {Object}            payload
     * @param   {requestCallback}   done
     */
    suspendAsync: function(payload, done) {
      return this.http.post(this.path + '/suspended-async', {
        data: payload,
        done: done
      });
    },

    /**
     * Sets a variable of a given process instance by id.
     *
     * @see http://docs.camunda.org/manual/develop/reference/rest/process-instance/variables/put-variable/
     *
     * @param   {uuid}              id
     * @param   {Object}            params
     * @param   {requestCallback}   done
     */
    setVariable: function(id, params, done) {
      var url = this.path + '/' + id + '/variables/' + utils.escapeUrl(params.name);
      return this.http.put(url, {
        data: params,
        done: done
      });
    },

    getVariables: function(params, done) {
      if (!params.id) {
        return done(new Error('No process id found'))
      }

      var url = this.path + '/' + params.id + '/variables';
      if (params.varId) {
        url += '/' + params.varId
        delete params.varId
      }

      return this.http.get(url, {
        done: done
      });
    }
  });


module.exports = ProcessInstance;

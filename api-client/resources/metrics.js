'use strict'

var AbstractClientResource = require('./../abstract-client-resource')



/**
 * Job Resource
 * @class
 * @memberof CamSDK.client.resource
 * @augments CamSDK.client.AbstractClientResource
 */
var Metrics = AbstractClientResource.extend()

/**
 * Path used by the resource to perform HTTP queries
 * @type {String}
 */
Metrics.path = 'metrics'

/**
 * Query for jobs that fulfill given parameters.
 * @param  {Object}   params
 * @param  {String}   [params.name]
 * @param  {String}   [params.startDate]
 * @param  {String}   [params.endDate]
 * @param  {Function} done
 */
Metrics.sum = function(params, done) {

  var path = this.path + '/' + params.name + '/sum'
  delete params.name

  return this.http.get(path, { data: params, done: done })
}

/**
 * Retrieves a list of metrics, aggregated for a given interval.
 * @param  {Object}   params
 * @param  {String}   params.name          The name of the metric. Supported names: activity-instance-end, job-acquisition-attempt, job-acquired-success, job-acquired-failure, job-execution-rejected, job-successful, job-failed, job-locked-exclusive, executed-decision-elements
 * @param  {String}   [params.reporter]    The name of the reporter (host), on which the metrics was logged.
 * @param  {String}   [params.startDate]   The start date (inclusive).
 * @param  {String}   [params.endDate]     The end date (exclusive).
 * @param  {Integer}  [params.firstResult] The index of the first result, used for paging.
 * @param  {Integer}  [params.maxResults]  The maximum result size of the list which should be returned. The maxResults can't be set larger than 200. Default: 200
 * @param  {Integer}  [params.interval]    The interval for which the metrics should be aggregated. Time unit is seconds. Default: The interval is set to 15 minutes (900 seconds).
 * @param  {Function} done
 */
Metrics.byInterval = function(params, done) {
  return this.http.get(this.path, { data: params, done: done })
}

module.exports = Metrics

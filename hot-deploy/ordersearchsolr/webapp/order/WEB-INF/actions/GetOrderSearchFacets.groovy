/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import java.sql.Timestamp;

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;

import org.ofbiz.base.util.*;

import org.ofbiz.orders.OrderServices;

keyword = parameters.keyword?.trim() ?: "";
customer = parameters.customer?.trim() ?: "";

// Get server object
server = new HttpSolrServer(OrderServices.getSolrHost(delegator, "orders"));

// Common query
commonQuery = new SolrQuery();
keywordString = keyword.split(" ")
keywordQueryString = "";
keywordString.each { token->
    token = ClientUtils.escapeQueryChars(token);
    if (keywordQueryString) {
        keywordQueryString = keywordQueryString + " OR *" + token + "*";
    } else {
        keywordQueryString = "*" + token + "*";
    }
}
commonQuery.setParam("q", "fullText:(" + keywordQueryString + ") AND orderTypeId:SALES_ORDER");
commonQuery.setFacet(true);

//Status Filter Query
searchedStatusString = parameters.status;
searchedStatus = searchedStatusString?.split(":");
statusFilterQuery = "";
if (searchedStatus) {
    searchedStatus.each { searchedStatusId ->
        if (searchedStatusId) {
            if (statusFilterQuery) {
                statusFilterQuery = statusFilterQuery + " OR " + searchedStatusId;
            } else {
                statusFilterQuery = searchedStatusId;
            }
        }
    }
    if (statusFilterQuery) {
        statusFilterQuery = "statusId:" + "(" + statusFilterQuery + ")";
    }
}

//Channel Filter Query
channelFilterQuery = "";
channel = parameters.channel;
if (channel) {
    channelFilterQuery = "salesChannelEnumId:" + channel;
}

// Status Facets
facetStatus = [];

//Get the order statuses
allStatusIds = delegator.findByAnd("StatusItem", [statusTypeId : "ORDER_STATUS"], ["sequenceId", "description"], false);

allStatusIds.each { status ->
    commonQuery.addFacetQuery("statusId:" + status.statusId);
}
if (channelFilterQuery) {
    commonQuery.addFilterQuery(channelFilterQuery);
}
// Get status facet results.
qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
rsp = qryReq.process(server);

Map<String, Integer> facetQuery = rsp.getFacetQuery();
commonParam = "";
if (parameters.keyword) {
    commonParam = "keyword=" + keyword;
}
if (commonParam) {
    statusUrlParam = commonParam + "&status=";
} else {
    statusUrlParam = "status=";
}
allStatusIds.each { status ->
    statusInfo = [:];
    statusParam = statusUrlParam;
    statusCount = facetQuery.get("statusId:" + status.statusId);
    commonQuery.removeFacetQuery("statusId:" + status.statusId);
    if (statusCount > 0 || searchedStatus?.contains(status.statusId)) {
        statusInfo.statusId = status.statusId;
        statusInfo.description = status.description;
        statusInfo.statusCount = statusCount;

        if (searchedStatus) {
            urlStatus = [];
            searchedStatus.each { searchedStatusId ->
                if (searchedStatusId){
                    if (!(searchedStatusId.equals(status.statusId))){
                        urlStatus.add(searchedStatusId);
                    }
                }
            }
            urlStatus.each { urlStatusId->
                statusParam = statusParam + ":" + urlStatusId;
            }
            if (!(searchedStatus.contains(status.statusId))) {
                statusParam = statusParam + ":" + status.statusId;
            }
        } else {
            statusParam = statusParam + status.statusId;
        }
        statusUrl = statusParam;
        if (channel) {
            statusUrl = statusUrl + "&channel=" + channel;
        }
        statusInfo.urlParam = statusUrl;
        facetStatus.add(statusInfo);
    }
}
if (channel) {
    statusUrlParam = statusUrlParam + "&channel=" + channel;
}
context.clearStatusUrl = statusUrlParam;

context.facetStatus = facetStatus;

//Channel Facets
facetChannels = [];

//Get the channels
allChannels = delegator.findByAnd("Enumeration", [enumTypeId : "ORDER_SALES_CHANNEL"], ["sequenceId"]);

allChannels.each { channel ->
    commonQuery.addFacetQuery("salesChannelEnumId:" + channel.enumId);
}
if (statusFilterQuery) {
    commonQuery.addFilterQuery(statusFilterQuery);
}
if (channelFilterQuery) {
    commonQuery.removeFilterQuery(channelFilterQuery);
}

//Get channel facet results.
qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
rsp = qryReq.process(server);
facetQuery = rsp.getFacetQuery();

defaultStatusParam = "";
if (searchedStatus) {
    searchedStatus.each { searchedStatusId ->
        if (searchedStatusId) {
            defaultStatusParam = defaultStatusParam + ":" + searchedStatusId;
        }
    }
}

if (commonParam) {
    channelParam = commonParam + "&channel=";
} else {
    channelParam = "channel=";
}
allChannels.each { channel ->
    channelInfo = [:];
    channelCount= facetQuery.get("salesChannelEnumId:" + channel.enumId);
    commonQuery.removeFacetQuery("salesChannelEnumId:" + channel.enumId);
    if (channelCount > 0) {
        channelUrlParam = channelParam;
        channelInfo.channelId = channel.enumId;
        channelInfo.description = channel.description;
        channelInfo.channelCount = channelCount;
        if (parameters.channel) {
            if (!parameters.channel.equals(channel.enumId)) {
                channelUrlParam = channelUrlParam + channel.enumId;
            } 
        } else {
            channelUrlParam = channelUrlParam + channel.enumId;
        }
        if(defaultStatusParam) {
            channelUrlParam = channelUrlParam + "&status=" + defaultStatusParam;
        }
        channelInfo.urlParam = channelUrlParam;
        facetChannels.add(channelInfo);
    }
}
context.facetChannels = facetChannels;

if (channelFilterQuery) {
    commonQuery.addFilterQuery(channelFilterQuery);
}
qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
rsp = qryReq.process(server);

facetQuery = rsp.getFacetQuery();
facetDays = [];
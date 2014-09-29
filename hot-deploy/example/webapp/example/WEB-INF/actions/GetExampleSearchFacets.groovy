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

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.ofbiz.example.ExampleServices;

HttpSolrServer server = new HttpSolrServer(ExampleServices.getSolrHost(delegator, "examples"));
SolrQuery query = new SolrQuery();
facetExampleTypes = [];
keyword = parameters.keyword?.trim() ?: "*";

exampleTypes = delegator.findList("ExampleType", null, null, null, null, false);

// calculation of facets
query.setParam("q", "*:*");
query.addFilterQuery("fullText:*" + keyword + "* OR " + "exampleId:*" + keyword + "*");
query.setFacet(true);

//exampleType facets for getting the count of example in each exampleType.
exampleTypes.each { exampleType ->
    query.addFacetQuery("exampleTypeId:" + exampleType.exampleTypeId);
}

statusQueryString = "";
if(parameters.statusId){
    searchedStatusesString = parameters.statusId;
    searchedStatuses = searchedStatusesString.split(":");
    searchedStatuses.each { status ->
        if(status) {
            if(statusQueryString) {
                statusQueryString = statusQueryString + " OR " + status;
            } else {
                statusQueryString = status;
            }
        }
    }
}
if (statusQueryString){
    query.addFilterQuery("statusId:(" + statusQueryString + ")");
}

QueryRequest qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
QueryResponse rsp = qryReq.process(server);
Map<String, Integer> facetQuery = rsp.getFacetQuery();

searchedExampleTypesString = parameters.exampleType;
searchedExampleTypes = searchedExampleTypesString?.split(":");

if(parameters.keyword){
    urlParam = "keyword=" + keyword + "&exampleType=";
} else {
    urlParam = "exampleType=";
}
// ExampleType URL parameters calculation
exampleTypes.each { exampleType ->
    exampleTypeInfo = [:];
    exampleTypeParam = urlParam;
    checked = true;
    exampleTypeCount = facetQuery.get("exampleTypeId:" + exampleType.exampleTypeId);
    if(exampleTypeCount > 0 || searchedExampleTypes?.contains(exampleType.exampleTypeId)) {
        exampleTypeInfo.description = exampleType.description;
        exampleTypeInfo.exampleTypeId = exampleType.exampleTypeId;
        exampleTypeInfo.exampleTypeCount = exampleTypeCount;

        if(searchedExampleTypes){
            urlExampleTypes = [];
            searchedExampleTypes.each { searchExampleType ->
                if(searchExampleType){
                    if(!(searchExampleType.equals(exampleType.exampleTypeId))){
                        urlExampleTypes.add(searchExampleType);
                    }
                }
            }
            urlExampleTypes.each { urlExampleType->
                exampleTypeParam = exampleTypeParam + ":"+ urlExampleType;
            }
            if(!(searchedExampleTypes.contains(exampleType.exampleTypeId))) {
                checked = false;
                exampleTypeParam = exampleTypeParam + ":"+ exampleType.exampleTypeId;
            }
        } else {
            exampleTypeParam = exampleTypeParam + exampleType.exampleTypeId;
        }
        if(parameters.statusId){
            exampleTypeParam = exampleTypeParam + "&statusId=" + parameters.statusId;
        }
        exampleTypeInfo.checked = checked;
        exampleTypeInfo.urlParam = exampleTypeParam;
        facetExampleTypes.add(exampleTypeInfo);
    }
}
context.clearExampleTypeUrl = urlParam + (parameters.statusId ? "&statusId=" + parameters.statusId : "");;

//example status facets
query.clear();
query.setParam("q", "*:*");
query.addFilterQuery("fullText:*" + keyword + "* OR " + "exampleId:*" + keyword + "*");
query.setFacet(true);

exampleStatuses = delegator.findByAnd("StatusItem", [statusTypeId : "EXAMPLE_STATUS"], null, false);
exampleStatuses.each { exampleStatus ->
    query.addFacetQuery("statusId:" + exampleStatus.statusId);
}

queryString = "";
statusUrlExampleTypeParam = urlParam;
if(searchedExampleTypes){
    searchedExampleTypes.each { searchExampleType ->
        if(searchExampleType){
            if(queryString) {
                queryString = queryString +" OR " + searchExampleType;
            } else {
                queryString = searchExampleType;
            }
            statusUrlExampleTypeParam = statusUrlExampleTypeParam + ":" + searchExampleType;
        }
    }
    if (queryString){
        query.addFilterQuery("exampleTypeId:" + "(" + queryString +")");
    }
}

qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
rsp = qryReq.process(server);
facetQuery = rsp.getFacetQuery();
facetExampleStatuses = [];

context.clearStatusUrl = statusUrlExampleTypeParam;

searchedExampleStatusesString = parameters.statusId;
searchedExampleStatuses = searchedExampleStatusesString?.split(":");

exampleStatuses.each { exampleStatus ->
    exampleStatusInfo = [:];
    checked = true;
    exampleStatusCount= facetQuery.get("statusId:" + exampleStatus.statusId);
    if(exampleStatusCount > 0) {
        exampleStatusUrlParam = statusUrlExampleTypeParam + "&statusId=";
        exampleStatusInfo.statusDesc = exampleStatus.description;
        exampleStatusInfo.statusId = exampleStatus.statusId;
        exampleStatusInfo.exampleStatusCount = exampleStatusCount;
        
        if(searchedExampleStatuses){
            urlExampleStatuses = [];
            searchedExampleStatuses.each { searchExampleStatus ->
                if(searchExampleStatus){
                    if(!(searchExampleStatus.equals(exampleStatus.statusId))){
                        urlExampleStatuses.add(searchExampleStatus);
                    }
                }
            }
            urlExampleStatuses.each { urlExampleStatus->
                exampleStatusUrlParam = exampleStatusUrlParam + ":"+ urlExampleStatus;
            }
            if(!(searchedExampleStatuses.contains(exampleStatus.statusId))) {
                checked = false;
                exampleStatusUrlParam = exampleStatusUrlParam + ":" + exampleStatus.statusId;
            }
        } else {
            exampleStatusUrlParam = exampleStatusUrlParam + exampleStatus.statusId;
        }
        exampleStatusInfo.checked = checked;
        exampleStatusInfo.urlParam = exampleStatusUrlParam;
        facetExampleStatuses.add(exampleStatusInfo);
    }
}
context.facetExampleTypes = facetExampleTypes;
context.facetExampleStatuses = facetExampleStatuses;
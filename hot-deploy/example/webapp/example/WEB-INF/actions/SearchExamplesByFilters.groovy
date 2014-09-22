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

import org.ofbiz.entity.util.EntityUtil;

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.common.SolrDocument;
import org.ofbiz.example.ExampleServices;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.response.QueryResponse;

HttpSolrServer server = new HttpSolrServer(ExampleServices.getSolrHost(delegator, "examples"));
SolrQuery query = new SolrQuery();

// filtered queries on facets.
keyword = parameters.keyword?.trim() ?: "*";
viewSize = Integer.valueOf(context.viewSize ?: 30);
viewIndex = Integer.valueOf(context.viewIndex ?: 0);

query.setParam("q", "*:*");
query.addFilterQuery("fullText:*" + keyword + "*");
queryString = "";

if(parameters.keyword){
    completeUrl = "keyword="+ keyword + "&exampleTypeId=";
} else {
    completeUrl = "exampleTypeId=";
}

if(parameters.exampleType) {
    searchedExampleTypesString = parameters.exampleType;
    searchedExampleTypes = searchedExampleTypesString.split(":");
    searchedExampleTypes.each { exampleType ->
        if(exampleType) {
            if(queryString) {
                queryString = queryString + " OR " + exampleType;
            } else {
                queryString = exampleType;
            }
            completeUrl = completeUrl + ":" + exampleType;
        }
    }
}

if (queryString){
    query.addFilterQuery("exampleTypeId:(" + queryString + ")");
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
            completeUrl = completeUrl + "&statusId=" + status;
        }
    }
}
if (statusQueryString){
    query.addFilterQuery("statusId:(" + statusQueryString + ")");
}
QueryRequest qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
QueryResponse rsp = qryReq.process(server);
listSize = Integer.valueOf(rsp.getResults().getNumFound().toString());

paginationValues = [:];
if (listSize) {
    lowIndex = (viewIndex * viewSize) + 1;
    highIndex = (viewIndex + 1) * viewSize;
    if( highIndex > listSize) {
        highIndex = listSize;
    }
    viewIndexLast = (listSize % viewSize) != 0 ? (listSize / viewSize + 1) : (listSize / viewSize);
    paginationValues.put("lowIndex", lowIndex);
    paginationValues.put("highIndex", highIndex);
    paginationValues.put("viewIndexLast", viewIndexLast);
}
query.setRows(viewSize);
query.setStart(paginationValues.get('lowIndex') - 1);
qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
rsp = qryReq.process(server);
SolrDocumentList docs = rsp.getResults();

exampleInfoList = [] as Set;
for (SolrDocument doc : docs) {
    exampleInfoList.add(["exampleId": (String) doc.get("exampleId"), "statusId": (String) doc.get("statusId"),"exampleTypeId": (String) doc.get("exampleTypeId"), "exampleName": (String) doc.get("exampleName")]);
}
exampleDetailList = [];
exampleInfoList.each { exampleInfo ->
    example = EntityUtil.getFirst(delegator.findByAnd("Example", [exampleId: exampleInfo.exampleId], null, true));
    if (example) {
        exampleDetailList.add(["exampleId": exampleInfo.exampleId, "exampleName": exampleInfo.exampleName]);
    }
}
context.exampleDetailList = exampleDetailList;
context.completeUrl = completeUrl;
context.viewIndex = viewIndex;
context.viewSize = viewSize;
context.lowIndex = paginationValues.get("lowIndex");
context.listSize = listSize;

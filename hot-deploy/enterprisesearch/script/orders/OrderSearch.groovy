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
import java.math.BigDecimal;
import java.sql.Timestamp;
import javolution.util.FastMap;

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.base.util.*;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.order.order.OrderReadHelper;
import org.ofbiz.orders.OrderServices;
import org.ofbiz.service.ServiceUtil;
import org.ofbiz.enterprisesearch.SearchHelper;


def getOrderSearchFacets () {
    result = [:];

    keyword = parameters.keyword?.trim() ?: "";
    customer = parameters.customer?.trim() ?: "";

    // Get server object
    server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "orders"));

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

    facetQuery = rsp.getFacetQuery();
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
    result.clearStatusUrl = statusUrlParam;
    
    result.facetStatus = facetStatus;

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
    result.facetChannels = facetChannels;
    
    if (channelFilterQuery) {
        commonQuery.addFilterQuery(channelFilterQuery);
    }
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);

    facetQuery = rsp.getFacetQuery();
    facetDays = [];
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}

/*---------------------------search orders by filters------------------------------*/

def searchOrderByFilters () {
    userLogin = delegator.findOne("UserLogin", [userLoginId : "system"], false);

    result = [:];

    int scale = UtilNumber.getBigDecimalScale("order.decimals");
    int rounding = UtilNumber.getBigDecimalRoundingMode("order.rounding");
    BigDecimal ZERO = (BigDecimal.ZERO).setScale(scale, rounding);

    keyword = parameters.keyword?.trim() ?: "";
    customer = parameters.customer?.trim() ?: "";
    viewSize = Integer.valueOf(parameters.viewSize ?: 20);
    viewIndex = Integer.valueOf(parameters.viewIndex ?: 0);
    channel = parameters.channel;
    status = parameters.status;

    //Get server object
    HttpSolrServer server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "orders"));

    // filtered queries on facets.
    query = new SolrQuery();
    keywordString = keyword.split(" ");
    keywordQueryString = "";
    keywordString.each { token->
        token = ClientUtils.escapeQueryChars(token);
        if (keywordQueryString) {
            keywordQueryString = keywordQueryString + " OR *" + token + "*";
        } else {
            keywordQueryString = "*" + token + "*";
        }
    }
    query.setParam("q", "fullText:(" + keywordQueryString + ") AND orderTypeId:SALES_ORDER");
    query.setParam("sort", "orderDate desc");
    
    completeUrlParam = "";
    if (parameters.keyword) {
        completeUrlParam = "keyword=" + keyword;
    }
    if (status) {
        queryStringStatusId = "";
        if (completeUrlParam) {
            completeUrlParam = completeUrlParam + "&status=";
        } else {
            completeUrlParam = "status=";
        }
        statusString = status;
        statusIds = statusString.split(":");
        statusIds.each { statusId ->
            if (statusId) {
                if (queryStringStatusId) {
                    queryStringStatusId = queryStringStatusId + " OR " + statusId;
                } else {
                    queryStringStatusId = statusId;
                }
                completeUrlParam = completeUrlParam + ":" + statusId;
            }
        }
        if (queryStringStatusId) {
            query.addFilterQuery("statusId:(" + queryStringStatusId + ")");
        }
    }
    
    if (channel) {
        if (completeUrlParam) {
            completeUrlParam = completeUrlParam + "&channel=" + channel;
        } else {
            completeUrlParam = "channel=" + channel;
        }
        query.addFilterQuery("salesChannelEnumId:" + channel);
    }
    
    completeUrlParamForPagination = completeUrlParam;
    
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    listSize = Integer.valueOf(rsp.getResults().getNumFound().toString());
    
    Map<String, Object> result = FastMap.newInstance();
    if (UtilValidate.isNotEmpty(listSize)) {
        Integer lowIndex = (viewIndex * viewSize) + 1;
        Integer highIndex = (viewIndex + 1) * viewSize;
        if (highIndex > listSize) {
            highIndex = listSize;
        }
        Integer viewIndexLast = (listSize % viewSize) != 0 ? (listSize / viewSize + 1) : (listSize / viewSize);
        result.put("lowIndex", lowIndex);
        result.put("highIndex", highIndex);
        result.put("viewIndexLast", viewIndexLast);
    }
    paginationValues = result;
    
    query.setRows(viewSize);
    query.setStart(paginationValues.get('lowIndex') - 1);
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    
    rsp = qryReq.process(server);
    docs = rsp.getResults();
    orderIds = [];
    docs.each { doc->
        orderIds.add((String) doc.get("orderId"));
    }
    orderList = delegator.findList("OrderHeader", EntityCondition.makeCondition("orderId", EntityOperator.IN, orderIds), null, ["orderDate DESC"], null, false);
    orderInfoList = [];
    orderList.each { order->
        orderInfo = [:];
        orderInfo.orderId = order.orderId;
        String orderDate = order.orderDate;
        orderInfo.grandTotal = order.grandTotal;
        orderInfo.orderDate = orderDate;
        orh = OrderReadHelper.getHelper(order);
        partyId = orh.getPlacingParty()?.partyId;
        orderInfo.partyId = partyId;
        partyEmailResult = dispatcher.runSync("getPartyEmail", [partyId: partyId, userLogin:userLogin]);
        orderInfo.emailAddress = partyEmailResult?.emailAddress;
        channel = order.getRelatedOne("SalesChannelEnumeration");
        orderInfo.channel = channel;
        partyNameResult = dispatcher.runSync("getPartyNameForDate", [partyId: partyId, compareDate: order.orderDate, userLogin: userLogin]);
        orderInfo.customerName = partyNameResult?.fullName;
        orderItems = orh.getOrderItems();
           BigDecimal totalItems = ZERO;
           orderItems.each { orderItem ->
               totalItems = totalItems.add(OrderReadHelper.getOrderItemQuantity(orderItem)).setScale(scale, rounding);
           }
        orderInfo.orderSize = totalItems.setScale(scale, rounding);
        statusItem = order.getRelatedOne("StatusItem");
        orderInfo.statusId = statusItem.statusId;
        orderInfo.statusDesc = statusItem.description;
        orderInfoList.add(orderInfo);
    }
    result.completeUrlParam = completeUrlParam;
    result.completeUrlParamForPagination = completeUrlParamForPagination;
    result.viewIndex = viewIndex;
    result.viewSize = viewSize;
    result.lowIndex = paginationValues.get("lowIndex");
    result.listSize = listSize;
    result.orderList = orderList;
	println "=====@@@@@@@@@===@@@@@@===orderList========${orderList}===";
    result.orderInfoList = orderInfoList;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.base.util.UtilDateTime;
import org.ofbiz.enterprisesearch.SearchHelper;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.order.order.OrderReadHelper;
import org.ofbiz.party.party.PartyHelper;
import org.ofbiz.service.ServiceUtil;
import java.sql.Timestamp;

def getPurchaseOrderSearchFacets () {
    result = [:];
    keyword = parameters.keyword?.trim() ?: "";

    // Get server object
    server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "enterpriseSearch"));

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
    commonQuery.setParam("q", "fullText:(" + keywordQueryString + ") AND docType:ORDER AND orderTypeId:PURCHASE_ORDER");
    commonQuery.setFacet(true);

    //Filter Queries

    //Status Filter Query
    searchedStatusString = parameters.status;
    searchedStatus = searchedStatusString?.split(":");
    statusFilterQuery = "";
    if (searchedStatus){
        searchedStatus.each { searchedStatusId ->
            if (searchedStatusId){
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
    
    //Days Filter Query
    daysFilterQuery = "";
    nowTimestamp = UtilDateTime.nowTimestamp();
    dayStart = UtilDateTime.getDayStart(nowTimestamp);
    if (parameters.minDate || parameters.maxDate) {
        // Solr supports yyyy-MM-dd'T'HH:mm:ss.SSS'Z' date format.
        df = UtilDateTime.toDateTimeFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getDefault(), locale);
        if (parameters.minDate && parameters.maxDate) {
            daysFilterQuery = "orderDate:[" + df.format(Timestamp.valueOf(parameters.minDate)) + " TO " + df.format(Timestamp.valueOf(parameters.maxDate)) + "]";
        } else if (parameters.minDate) {
            daysFilterQuery = "orderDate:[" + df.format(Timestamp.valueOf(parameters.minDate)) + " TO *]";
        } else if (parameters.maxDate) {
            daysFilterQuery = "orderDate:[* TO " + df.format(Timestamp.valueOf(parameters.maxDate)) + "]";
        }
    } else if (parameters.days){
        if ("More".equals(parameters.days)) {
            daysFilterQuery = "orderDate:[* TO NOW-30DAY]";
        } else {
            daysFilterQuery = "orderDate:[NOW-" + parameters.days + "DAY TO *]"
        }
    }
    
    // Status Facets
    facetStatus = [];
    
    //Get the order statuses
    allStatusIds = delegator.findByAnd("StatusItem", [statusTypeId : "ORDER_STATUS"], ["sequenceId", "description"], false);
    
    allStatusIds.each { status ->
        commonQuery.addFacetQuery("statusId:" + status.statusId);
    }
    
    if (daysFilterQuery){
        commonQuery.addFilterQuery(daysFilterQuery);
    }
    
    // Get status facet results.
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    Map<String, Integer> facetQuery = rsp.getFacetQuery();
    commonParam = "";
    if (parameters.keyword) {
        commonParam = "keyword=" + keyword;
    }
    
    dateParam = "";
    if (parameters.minDate || parameters.maxDate) {
        if (parameters.minDate && parameters.maxDate) {
            dateParam = "&minDate=" + parameters.minDate + "&maxDate=" + parameters.maxDate;
        } else if (parameters.minDate) {
            dateParam = "&minDate=" + parameters.minDate;
        } else if (parameters.maxDate) {
            dateParam = "&maxDate=" + parameters.maxDate;
        }
    } else if (parameters.days) {
        dateParam = "&days=" + parameters.days;
    }
    if (commonParam){
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
    
            if (searchedStatus){
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
            if (dateParam) {
                statusUrl = statusUrl + dateParam;
            }
            statusInfo.urlParam = statusUrl;
            facetStatus.add(statusInfo);
        }
    }
    if (dateParam) {
        statusUrlParam = statusUrlParam + dateParam;
    }
    
    result.clearStatusUrl = statusUrlParam;
    
    result.facetStatus = facetStatus;
    
    //Date facets
    
    facetDays = [];
    noOfDays = ["0": "Today", "7": "Last 7 days", "30": "Last 30 days", "More": "More than 30 days"];
    noOfDaysQuery = [:];
    
    noOfDays.each { key, value ->
        if ("More".equals(key)) {
            noOfDaysQuery.put(key, "orderDate:[* TO NOW-30DAY]");
        } else {
            noOfDaysQuery.put(key, "orderDate:[NOW-" + key + "DAY TO *]");
        }
        commonQuery.addFacetQuery(noOfDaysQuery.get(key));
    }
    
    // Get date facet results.
    if (daysFilterQuery){
        commonQuery.removeFilterQuery(daysFilterQuery);
    }
    defaultStatusParam = "";
    if (searchedStatus) {
        searchedStatus.each { searchedStatusId ->
            if (searchedStatusId){
                defaultStatusParam = defaultStatusParam + ":" + searchedStatusId;
            }
        }
    }
    
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    facetQuery = rsp.getFacetQuery();
    facetDays = [];
    
    if (commonParam){
        daysParam = commonParam + "&days=";
    } else {
        daysParam = "days=";
    }
    
    noOfDays.each { key, value ->
        daysInfo = [:];
        daysCount = facetQuery.get(noOfDaysQuery.get(key));
        commonQuery.removeFacetQuery(noOfDaysQuery.get(key));
        if (daysCount > 0) {
            daysUrlParam = daysParam;
            daysInfo.days = key;
            daysInfo.daysDescription = value;
            daysInfo.daysCount = daysCount;
            if (parameters.days){
                if (!(parameters.days.equals(key))){
                    daysUrlParam = daysUrlParam + key;
                }
            } else {
                daysUrlParam = daysUrlParam + key;
            }
            if(defaultStatusParam) {
                daysUrlParam = daysUrlParam + "&status=" + defaultStatusParam;
            }
            daysInfo.urlParam = daysUrlParam;
            facetDays.add(daysInfo);
        }
    }
    
    result.clearDaysUrl = commonParam+"&status=" + defaultStatusParam;
    result.facetDays = facetDays;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}

def getPurchaseOrderSearchResults () {
    result = [:];
    userLogin = delegator.findOne("UserLogin", [userLoginId : "system"], false);
    keyword = parameters.keyword?.trim() ?: "";
    customer = parameters.customer?.trim() ?: "";
    viewSize = Integer.valueOf(parameters.viewSize ?: 20);
    viewIndex = Integer.valueOf(parameters.viewIndex ?: 0);
    minDate = parameters.minDate;
    maxDate = parameters.maxDate;
    days = parameters.days;
    status = parameters.status;

    //Get server object
    HttpSolrServer server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "enterpriseSearch"));

    // filtered queries on facets.
    query = new SolrQuery();
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
    query.setParam("q", "fullText:(" + keywordQueryString + ") AND docType:ORDER AND orderTypeId:PURCHASE_ORDER");
    query.setParam("sort", "orderDate desc");
    
    completeUrlParam = "";
    if(parameters.keyword) {
        completeUrlParam = "keyword=" + keyword;
    }
    if(status) {
        queryStringStatusId = "";
        if(completeUrlParam){
            completeUrlParam = completeUrlParam + "&status=";
        } else {
            completeUrlParam = "status=";
        }
        statusString = status;
        statusIds = statusString.split(":");
        statusIds.each { statusId ->
            if(statusId) {
                if(queryStringStatusId) {
                    queryStringStatusId = queryStringStatusId + " OR " + statusId;
                } else {
                    queryStringStatusId = statusId;
                }
                completeUrlParam = completeUrlParam + ":" + statusId;
            }
        }
        if (queryStringStatusId){
            query.addFilterQuery("statusId:(" + queryStringStatusId + ")");
        }
    }
    
    completeUrlParamForPagination = completeUrlParam;
    
    if (minDate || maxDate) {
        df = UtilDateTime.toDateTimeFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getDefault(), locale);
        if(minDate && maxDate) {
            dayQuery = "orderDate:[" + df.format(Timestamp.valueOf(minDate)) + " TO " + df.format(Timestamp.valueOf(maxDate)) + "]";
            completeUrlParamForPagination = completeUrlParamForPagination + "&minDate=" + minDate + "&maxDate=" + maxDate;
        } else if (minDate) {
            dayQuery = "orderDate:[" + df.format(Timestamp.valueOf(minDate)) + " TO *]";
            completeUrlParamForPagination = completeUrlParamForPagination + "&minDate=" + minDate;
        } else if(maxDate) {
            dayQuery = "orderDate:[* TO " + df.format(Timestamp.valueOf(maxDate)) + "]";
            completeUrlParamForPagination = completeUrlParamForPagination + "&maxDate=" + maxDate;
        }
        query.addFilterQuery(dayQuery);
    } else if(days){
        if("More".equals(days)) {
            dayQuery = "orderDate:[* TO NOW-30DAY]";
        } else {
            dayQuery = "orderDate:[NOW-" + days + "DAY TO *]";
        }
        query.addFilterQuery(dayQuery);
        completeUrlParamForPagination = completeUrlParamForPagination + "&days=" + days;
    }
    
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    listSize = Integer.valueOf(rsp.getResults().getNumFound().toString());
    paginationValues = SearchHelper.getPaginationValues(viewSize, viewIndex, listSize);
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
    orderIds.each { orderId->
        orderInfo = [:];
        order = EntityUtil.getFirst(EntityUtil.filterByCondition(orderList, EntityCondition.makeCondition("orderId", EntityOperator.EQUALS, orderId)));
        orderReadHelper = new OrderReadHelper(order);
        supplier = orderReadHelper.getSupplierAgent();
        if (supplier) {
            partyId = supplier.partyId;
        }
        orderInfo.orderId = order.orderId;
        orderInfo.orderDate = UtilDateTime.toDateString(order.orderDate);
        orderInfo.uom = orderReadHelper.getCurrency();
        orderInfo.partyId = partyId;
        orderInfo.supplierName = PartyHelper.getPartyName(delegator, partyId, false);
        orderInfo.grandTotal = order.grandTotal;
        partyEmailResult = dispatcher.runSync("getPartyEmail", [partyId: partyId, userLogin: userLogin]);
        orderInfo.emailAddress = partyEmailResult?.emailAddress;
        orderInfo.orderSize = orderReadHelper.getTotalOrderItemsQuantity();
        statusItem = order.getRelatedOne("StatusItem", true);
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
    result.orderInfoList = orderInfoList;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.enterprisesearch.SearchHelper;
import org.ofbiz.entity.condition.EntityConditionBuilder;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.service.ServiceUtil;

def getShipmentSearchFacets () {
    result = [:];
    keyword = parameters.keyword?.trim() ?: "";
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

    // Get server object & make new query object
    server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "enterpriseSearch"));
    commonQuery = new SolrQuery();

    //Get the shipment status list
    exprBldr = new EntityConditionBuilder();
    shipmentStatusTypes = [];
    //if (security.hasEntityPermission("SALES_SHIPMENT", "_ADMIN", session)) {
        shipmentStatusTypes.add("SHIPMENT_STATUS");
    //}
   // if (security.hasEntityPermission("RECEIVING", "_ADMIN", session)) {
        shipmentStatusTypes.add("PURCH_SHIP_STATUS");
    //}
    shipmentStatusItems = delegator.findList("StatusItem", exprBldr.IN(statusTypeId: shipmentStatusTypes), null, ["sequenceId", "description"], null, false);
    
    commonQuery.setParam("q", "fullText:(" + keywordQueryString + ") AND docType:SHIPMENT");
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    /*as  PURCH_SHIP_CREATED & SHIPMENT_INPUT both reffers to Created status so we will treat this as same status & will make facet query accordingly*/
    
    statusItemsForFacets = [];
    createdStatusItem = [:];
    statusId = null;
    shipmentStatusItems.each { status ->
        if ("PURCH_SHIP_CREATED".equals(status.statusId) || "SHIPMENT_INPUT".equals(status.statusId)) {
            if (statusId) {
                statusId = statusId + " OR " + status.statusId;
            } else {
                statusId = status.statusId;
            }
        } else {
            statusItemsForFacets.add(status);
            commonQuery.addFacetQuery("statusId:(" + status.statusId+")");
        }
    }
    createdStatusItem.statusId = statusId;
    createdStatusItem.description = "Created";
    statusItemsForFacets.add(createdStatusItem);
    commonQuery.addFacetQuery("statusId:("+createdStatusItem.statusId+")"); // adding merged query for PURCH_SHIP_CREATED & SHIPMENT_INPUT status items separately
    
    commonQuery.setFacet(true);
    
    // shipment type filteration for status facet
    shipmentTypeFilterQuery = "";
    if(parameters.shipmentTypeId){
        shipmentTypes = parameters.shipmentTypeId.split(":");
        if(shipmentTypes) {
            shipmentTypes.each { shipmentType->
                if (shipmentTypeFilterQuery) {
                    shipmentTypeFilterQuery = shipmentTypeFilterQuery + " OR " + shipmentType;
                } else {
                    shipmentTypeFilterQuery = shipmentType;
                }
            }
        }
    }
    if (shipmentTypeFilterQuery) {
        shipmentTypeFilterQuery = "shipmentTypeId: " + "(" + shipmentTypeFilterQuery + ")";
        commonQuery.addFilterQuery(shipmentTypeFilterQuery);
    }
    
    //Status Filter Query
    searchedStatusString = parameters.status;
    searchedStatus = searchedStatusString?.split(":");
    
    // Status Facets
    facetStatus = [];
    
    // Get status facet results.
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    Map<String, Integer> facetQuery = rsp.getFacetQuery();
    urlParam = "";
    if (parameters.keyword) {
        urlParam = "keyword=" + keyword;
    }
    
    if (urlParam){
        urlParam = urlParam + "&status=";
    } else {
        urlParam = "status=";
    }
    
    statusItemsForFacets.each { status ->
        statusInfo = [:];
        statusParam = urlParam;
        statusCount = facetQuery.get("statusId:(" +status.statusId+")");
        commonQuery.removeFacetQuery("statusId:(" + status.statusId+")");
        if (statusCount > 0 || searchedStatus?.contains(status.statusId)) {
            statusInfo.statusId = status.statusId;
            //TODO: This should be handleled client side.
            if (searchedStatus && searchedStatus.contains(status.statusId)) {
                statusInfo.isChecked = true;
            }
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
            statusInfo.urlParam = statusUrl;
            facetStatus.add(statusInfo);
        }
    }
    
    clearStatusUrl = urlParam;
    
    //Shipment type Filter Query
    exprBldr = new EntityConditionBuilder();
    shipmentTypeIds = [];
   // if (security.hasEntityPermission("SALES_SHIPMENT", "_ADMIN", session)) {
        shipmentTypeIds.add("SALES_SHIPMENT");
    //}
    if (security.hasEntityPermission("RECEIVING", "_ADMIN", session)) {
        shipmentTypeIds.add("PURCHASE_SHIPMENT");
        shipmentTypeIds.add("SALES_RETURN");
    }
    shipmentTypes = delegator.findList("ShipmentType", exprBldr.IN(shipmentTypeId: shipmentTypeIds), null, ['description'], null, false);
    
    //preparing query
    commonQuery.clear();
    commonQuery.setParam("q", "fullText:(" + keywordQueryString + ") AND docType:SHIPMENT");
    shipmentTypes.each { shipmentType ->
        commonQuery.addFacetQuery("shipmentTypeId:" + shipmentType.shipmentTypeId);
    }
    commonQuery.setFacet(true);
    
    queryString = "";
    typeUrlStatusParam = urlParam;
    
    if(searchedStatus){
        searchedStatus.each { searchedStatusId ->
            if(searchedStatusId){
                if(queryString) {
                    queryString = queryString +" OR " + searchedStatusId;
                } else {
                    queryString = searchedStatusId;
                }
                typeUrlStatusParam = typeUrlStatusParam + ":" + searchedStatusId;
            }
        }
        if (queryString){
            commonQuery.addFilterQuery("statusId:" + "(" + queryString +")");
        }
    }
    
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    facetQuery = rsp.getFacetQuery();
    facetShipmentTypes = [];
    
    clearShipmentTypeUrl = typeUrlStatusParam;
    
    shipmentTypes.each { shipmentType ->
        shipmentTypeInfo = [:];
        shipmentTypeUrlParam = typeUrlStatusParam;
        shipmentTypeCount = facetQuery.get("shipmentTypeId:" + shipmentType.shipmentTypeId);
        if (shipmentTypeCount > 0) {
            shipmentTypeUrlParam = typeUrlStatusParam;
            shipmentTypeInfo.shipmentTypeId = shipmentType.shipmentTypeId;
            //TODO: This should be handleled client side.
            selectedShipmentType = parameters.shipmentTypeId;
            if (selectedShipmentType && selectedShipmentType.equals(shipmentType.shipmentTypeId)) {
                shipmentTypeInfo.isChecked = true;
            }
            shipmentTypeInfo.description = shipmentType.description;
            shipmentTypeInfo.shipmentTypeCount = shipmentTypeCount;

            if (parameters.shipmentTypeId) {
                if (!parameters.shipmentTypeId.equals(shipmentType.shipmentTypeId)) {
                    shipmentTypeUrlParam = shipmentTypeUrlParam + "&shipmentTypeId=" + shipmentType.shipmentTypeId;
                }
            } else {
                shipmentTypeUrlParam = shipmentTypeUrlParam + "&shipmentTypeId=" + shipmentType.shipmentTypeId;
            }
            shipmentTypeInfo.urlParam = shipmentTypeUrlParam;
            facetShipmentTypes.add(shipmentTypeInfo);
        }
    }

    result.clearStatusUrl = clearStatusUrl
    result.clearShipmentTypeUrl = clearShipmentTypeUrl
    result.facetShipmentTypes = facetShipmentTypes;
    result.facetStatus = facetStatus;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}

def getShipmentSearchResults () {
    result = [:];
    userLogin = delegator.findOne("UserLogin", [userLoginId : "system"], false);
    
    keyword = parameters.keyword?.trim() ?: "";
    status = parameters.status;
    shipmentTypeId = parameters.shipmentTypeId;
    viewSize = Integer.valueOf(parameters.viewSize ?: 20);
    viewIndex = Integer.valueOf(parameters.viewIndex ?: 0);

    // Get server object & create new query object
    server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "enterpriseSearch"));
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

    shipmentTypes = null;
    if (security.hasEntityPermission("SALES_SHIPMENT", "_ADMIN", session) && security.hasEntityPermission("RECEIVING", "_ADMIN", session)) {
        shipmentTypes = "SALES_SHIPMENT OR PURCHASE_SHIPMENT OR SALES_RETURN";
    } else if (security.hasEntityPermission("SALES_SHIPMENT", "_ADMIN", session)) {
        shipmentTypes = "SALES_SHIPMENT";
    } else if (security.hasEntityPermission("RECEIVING", "_ADMIN", session)) {
        shipmentTypes = "PURCHASE_SHIPMENT OR SALES_RETURN";
    }
    commonQuery.setParam("q", "fullText:(" + keywordQueryString + ") AND docType:SHIPMENT AND shipmentTypeId:(" + shipmentTypes + ")");
    
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
            commonQuery.addFilterQuery("statusId:(" + queryStringStatusId + ")");
        }
    }
    
    if (shipmentTypeId) {
        queryStringShipmentTypeId = "";
        if (completeUrlParam) {
            completeUrlParam = completeUrlParam + "&shipmentTypeId=";
        } else {
            completeUrlParam = "shipmentTypeId=";
        }
        shipmentTypeString = shipmentTypeId;
        shipmentTypeIds = shipmentTypeString.split(":");
        shipmentTypeIds.each { shipmentTypeId ->
            if(shipmentTypeId) {
                if(queryStringShipmentTypeId) {
                    queryStringShipmentTypeId = queryStringShipmentTypeId + " OR " + shipmentTypeId;
                } else {
                    queryStringShipmentTypeId = shipmentTypeId;
                }
                completeUrlParam = completeUrlParam + ":" + shipmentTypeId;
            }
        }
        if (queryStringShipmentTypeId) {
            commonQuery.addFilterQuery("shipmentTypeId:(" + queryStringShipmentTypeId + ")");
        }
    }
    
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    
    listSize = Integer.valueOf(rsp.getResults().getNumFound().toString());
    paginationValues = SearchHelper.getPaginationValues(viewSize, viewIndex, listSize);
    commonQuery.setRows(viewSize);
    commonQuery.setStart(paginationValues.get('lowIndex') - 1);
    
    qryReq = new QueryRequest(commonQuery, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    docs = rsp.getResults();
    
    exprBldr = new EntityConditionBuilder();
    shipments = delegator.findList("Shipment", exprBldr.IN("shipmentId": docs.shipmentId), null, null, null, false);
    filteredShipments = [];
    docs.each { doc->
        shipmentMap = [:];
        shipment = EntityUtil.getFirst(EntityUtil.filterByCondition(shipments, exprBldr.EQUALS("shipmentId": doc.shipmentId)));
        shipmentMap.put("shipment", shipment);
        shipmentStatusItem = shipment.getRelatedOneCache("StatusItem");
        shipmentMap.put("shipmentStatusItem", shipmentStatusItem);
        shipmentType = shipment.getRelatedOneCache("ShipmentType");
        shipmentMap.put("shipmentType", shipmentType);
        if ("SALES_RETURN".equals(shipment.shipmentTypeId)) {
            partyName = PartyHelper.getPartyName(delegator, shipment.partyIdFrom, false);
            shipmentMap.put("partyName", partyName);
            returnHeader = delegator.findOne("ReturnHeader", ["returnId" : shipment.primaryReturnId], false);
            shipmentMap.put("returnId", shipment.primaryReturnId);
            returnStatusItem = delegator.findOne("StatusItem", ["statusId" : returnHeader.statusId], true);
            shipmentMap.put("returnStatusItem", returnStatusItem);
            
        } else {
            shipmentMap.put("orderId", shipment.primaryOrderId);
            orderHeader = delegator.findOne("OrderHeader", ["orderId" : shipment.primaryOrderId], false);
            orderStatusItem = delegator.findOne("StatusItem", ["statusId" : orderHeader.statusId], true);
            shipmentMap.put("orderStatusItem", orderStatusItem);

            if ("SALES_SHIPMENT".equals(shipmentType.shipmentTypeId) && shipment.partyIdTo) {
                partyName = PartyHelper.getPartyName(delegator, shipment.partyIdTo, false);
            } else if ("PURCHASE_SHIPMENT".equals(shipmentType.shipmentTypeId) && ) {
                partyName = PartyHelper.getPartyName(delegator, shipment.partyIdFrom, false);
            }
        }
        filteredShipments.add(shipmentMap);
    }
    result.completeUrl = completeUrlParam;
    result.shipments = filteredShipments;
    result.listSize = listSize;
    result.viewSize = viewSize;
    result.viewIndex = viewIndex;

    if (security.hasEntityPermission("SALES_SHIPMENT", "_ADMIN", session) || security.hasEntityPermission("RECEIVING", "_ADMIN", session)) {
        result.userHasPermission = "Y";
    }

    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}
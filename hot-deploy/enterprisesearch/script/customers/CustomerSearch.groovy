import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.enterprisesearch.SearchHelper;

import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionBuilder;
import org.ofbiz.entity.condition.EntityFunction;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.party.contact.ContactMechWorker;
import org.ofbiz.service.ServiceUtil;

def getCustomerSearchDetails () {
    result = [:];
    userLogin = delegator.findOne("UserLogin", [userLoginId : "system"], false);
    keyword = parameters.keyword?.trim() ?: "";
    viewSize = Integer.valueOf(parameters.viewSize ?: 20);
    viewIndex = Integer.valueOf(parameters.viewIndex ?: 0);
    HttpSolrServer server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "party"));

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
    query.setParam("q", "fullText:(" + keywordQueryString + ")");
    query.addFilterQuery("roleTypeId:CUSTOMER");
    query.addFilterQuery("partyTypeId:PERSON");
    if (!keyword) {
        query.setParam("sort", "partyName asc");
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
    
    customerDetailsList = [];
    docs.each { doc ->
        partyId = doc.partyId;
        customerValueMap = [:];
        customerContactNumberValueMaps = ContactMechWorker.getPartyContactMechValueMaps(delegator, partyId, false, "TELECOM_NUMBER");
        exprBldr = new EntityConditionBuilder();
        cond = exprBldr.AND() {
            NOT_EQUAL(contactNumber: "");
            NOT_EQUAL(contactNumber: null);
        }
        telecomNumbers = EntityUtil.filterByCondition(customerContactNumberValueMaps.telecomNumber, cond);
        customerEmailAddress = dispatcher.runSync("getPartyEmail", ["partyId" : partyId, "userLogin" : userLogin]);
        person = delegator.findOne("Person", [partyId : partyId], false);
    
        customerValueMap.firstName = person?.firstName;
        customerValueMap.lastName = person?.lastName;
        customerValueMap.infoString = customerEmailAddress.emailAddress;
        customerValueMap.telecomNumbers = telecomNumbers;
        customerValueMap.partyId = partyId;

        customerDetailsList.add(customerValueMap);
    }
    
    result.customerDetailsList = customerDetailsList;
    result.listSize = listSize;
    result.viewIndex = viewIndex;
    result.viewSize = viewSize;

    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}
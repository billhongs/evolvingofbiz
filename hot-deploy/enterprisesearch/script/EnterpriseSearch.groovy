import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.order.order.OrderReadHelper;
import org.ofbiz.party.party.PartyWorker;
import org.ofbiz.service.ServiceUtil;
import org.ofbiz.base.util.UtilFormatOut;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.enterprisesearch.SearchHelper;

def getEnterpriseSearchResults () {

keyword = parameters.keyword?.trim() ?: "";
userLogin = delegator.findOne("UserLogin", [userLoginId : "system"], false);

HttpSolrServer server = new HttpSolrServer(SearchHelper.getSolrHost(delegator, "enterpriseSearch"));

allDocs = [MENU: [description:"Application", app: "app"],
           CUSTOMER:[description:"Customers", app: "csr"],
           ORDER: [description:"Orders", app: "csr"],
           CATEGORY: [description:"Categories", app: "pim"],
           APPLICATION_USER: [description:"Users", app: "admin"]];

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
query = new SolrQuery();
completeResult = [:];

allDocs.each { key, value ->
    docTypeAndDetails = [:];
    query.setParam("q", "title:(" + keywordQueryString + ") AND docType:" + key);
    if("CUSTOMER".equals(key) || "APPLICATION_USER".equals(key)) {
        query.addFilterQuery("partyTypeId:PERSON");
    }
    query.setRows(5);
    query.setStart(0);
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);

    rsp = qryReq.process(server);
    docs = rsp.getResults();
    if(docs) {
        docTypeAndDetails.put("appDescription", value.description);
        docTypeAndDetails.put("app", value.app);
        docInfoList = [];
        docs.each { doc ->
            docInfo = [:];
            docInfo.docType = doc.docType;
            docInfo.docTypeIdentifier = doc.get("docType-identifier");
            docInfo.title = doc.title;
            if("MENU".equals(key)) {
                menuContentList = delegator.findByAnd("DataResourceContentView", [coContentId : doc.identifier], null, false);
                if(menuContentList) {
                    docInfo.docUrl = menuContentList.first()?.objectInfo + "?";
                }
            } else if("ORDER".equals(key)) {
                order = delegator.findOne("OrderHeader", [orderId: doc.identifier], false);
                docInfo.orderId = doc.identifier;
                docInfo.orderType = doc.orderTypeId;
                orh = OrderReadHelper.getHelper(order);
                grandTotal = UtilFormatOut.formatCurrency(order.grandTotal, orh.getCurrency(), locale)
                docInfo.grandTotal = grandTotal;
                if("SALES_ORDER".equals(doc.orderTypeId)) {
                    /*change it as per angularjs routing
                     * docInfo.docUrl = "/csr/control/orderview?orderId="+doc.orderId;*/
                    partyId = orh.getBillToParty()?.partyId;
                } else {
                    /*change as per angularjs routing
                     * docInfo.docUrl = "/procurement/control/ViewPO?orderId="+doc.orderId;*/
                    partyId = orh.getBillFromParty()?.partyId;
                }
                docInfo.partyId = partyId;
                channel = order.getRelatedOne("SalesChannelEnumeration");
                docInfo.channel = channel;
                partyNameResult = dispatcher.runSync("getPartyNameForDate", [partyId: partyId, compareDate: order.orderDate, userLogin: userLogin]);
                docInfo.customerName = partyNameResult?.fullName;
                statusItem = order.getRelatedOne("StatusItem");
                docInfo.statusId = statusItem.statusId;
                docInfo.statusDesc = statusItem.description;
            } else if("CUSTOMER".equals(key)) {
                /* Manage it using angular routing
                 * docInfo.docUrl = "/csr/control/CustomerProfile?partyId="+doc.identifier;*/
            } else if("CATEGORY".equals(key)) {
                category = delegator.findOne("ProductCategory", [productCategoryId: doc.identifier], false);
                parentCategory = null;
                try {
                    parentCategory = delegator.findOne("ProductCategory", UtilMisc.toMap("productCategoryId", category.primaryParentCategoryId), false);
                } catch (e) {
                    Debug.logError(e, "Error in finding product category", module);
                }
                docInfo.parentCategoryName = parentCategory?.categoryName;
                /* manage it using anular routing.
                 * docInfo.docUrl = "/pim/control/CategoryOverview?productCategoryId="+doc.productCategoryId;*/
            } else if("APPLICATION_USER".equals(key)) {
                partyUserLogin = PartyWorker.findPartyLatestUserLogin(doc.identifier, delegator);
				/* manage it using anular routing.
                docInfo.docUrl = "/admin/control/ViewUserProfile?userLoginId="+partyUserLogin?.userLogin.userLoginId;
                */
            }
            docInfoList.add(docInfo);
        }
        docTypeAndDetails.put("docInfoList", docInfoList);
        completeResult.put(key, docTypeAndDetails);
    }
}
result = [:];
result.allDocs = completeResult;

serviceResult = ServiceUtil.returnSuccess();
serviceResult.put("result", result);
return serviceResult;
}

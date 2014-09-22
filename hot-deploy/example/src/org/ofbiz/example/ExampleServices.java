package org.ofbiz.example;

import java.io.IOException;
import java.util.Map;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrDocument;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class ExampleServices {

    public static Map<String, Object> indexExample(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        String exampleId = (String) context.get("exampleId");
        String solrHost = getSolrHost(delegator, "examples");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        SolrDocument solrDocument = new SolrDocument();
        solrDocument.addField("exampleId", exampleId);
        solrDocument.addField("exampleName", context.get("exampleName"));
        solrDocument.addField("description", context.get("description"));
        solrDocument.addField("fullText", exampleId);
        solrDocument.addField("fullText", context.get("exampleName"));
        solrDocument.addField("fullText", context.get("description"));
        solrDocument.addField("exampleTypeId", context.get("exampleTypeId"));
        solrDocument.addField("statusId", context.get("statusId"));
        try {
            server.add(ClientUtils.toSolrInputDocument(solrDocument));
            server.commit();
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ServiceUtil.returnSuccess();
    }

    public static String getSolrHost(Delegator delegator, String indexName) {
        String solrHost = UtilProperties.getPropertyValue("Search", "solr.host");
        if(UtilValidate.isNotEmpty(solrHost)) {
            solrHost += "/" + indexName;
            String tenantId = delegator.getDelegatorTenantId();
            if(UtilValidate.isNotEmpty(tenantId)) {
                solrHost = solrHost + "-" + tenantId;
            }
        }
        return solrHost;
    }
}

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

package org.ofbiz.orders;

import java.io.IOException;
import java.text.DateFormat;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javolution.util.FastMap;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilDateTime;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.util.EntityListIterator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.party.party.PartyHelper;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class OrderServices { 
	
	public static final String module = OrderServices.class.getName();

    public static String getSolrHost(Delegator delegator, String coreName) {
        String solrHost = UtilProperties.getPropertyValue("search", "solr.host");
        if (UtilValidate.isNotEmpty(solrHost)) {
            solrHost += "/" + coreName;
            String tenantId = delegator.getDelegatorTenantId();
            if (UtilValidate.isNotEmpty(tenantId)) {
                solrHost = solrHost + "-" + tenantId;
            }
        }
        return solrHost;
    }

    public static Map<String, Object> getPaginationValues(Integer viewSize, Integer viewIndex, Integer listSize) {
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
        return result;
    }

    public static Map<String, Object> createOrderIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        String orderId = (String) context.get("orderId");
        Locale locale = (Locale) context.get("locale");
        String solrHost = getSolrHost(delegator, "orders");
        String enterpriseSearchHost = getSolrHost(delegator, "enterpriseSearch");
        try {
            HttpSolrServer server = new HttpSolrServer(solrHost);
            HttpSolrServer enterpriseSearchServer = new HttpSolrServer(enterpriseSearchHost);
            GenericValue order = delegator.findOne("OrderHeader", UtilMisc.toMap("orderId", orderId), false);
            SolrDocument solrDocument = new SolrDocument();
            solrDocument.addField("orderId", orderId);
            solrDocument.addField("orderTypeId", order.get("orderTypeId"));
            solrDocument.addField("statusId", order.get("statusId"));
            GenericValue orderItem = EntityUtil.getFirst(order.getRelated("OrderItem", null, null, false));
            if(UtilValidate.isNotEmpty(orderItem.get("correspondingPoId"))) {
                solrDocument.addField("correspondingPoId", orderItem.get("correspondingPoId"));
            }
            // Solr supports yyyy-MM-dd'T'HH:mm:ss.SSS'Z' date format.
            DateFormat df = UtilDateTime.toDateTimeFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getDefault(), locale);
            solrDocument.addField("orderDate", df.format(order.get("orderDate")));
            String roleTypeId = "BILL_TO_CUSTOMER";
            if ("PURCHASE_ORDER".equals(order.getString("orderTypeId"))) {
                roleTypeId = "BILL_FROM_VENDOR";
            }
            GenericValue orderRole = EntityUtil.getFirst(order.getRelated("OrderRole", UtilMisc.toMap("roleTypeId", roleTypeId), null, false));
            solrDocument.addField("customer", PartyHelper.getPartyName(delegator, orderRole.getString("partyId"), false));
            solrDocument.addField("salesChannelEnumId", order.get("salesChannelEnumId"));
            SolrInputDocument doc= ClientUtils.toSolrInputDocument(solrDocument);
            server.add(doc);
            server.commit();
            doc.addField("docType", "ORDER");
            doc.addField("identifier", orderId);
            doc.addField("title", "Order " + orderId + " placed by " + doc.getFieldValue("customer") + " on "+ order.get("orderDate") + ".");
            enterpriseSearchServer.add(doc);
        } catch (GenericEntityException e) {
            Debug.logError(e, module);
        } catch (IOException e) {
            Debug.logError(e, module);
        } catch (SolrServerException e) {
            Debug.logError(e, module);
        }
        return ServiceUtil.returnSuccess();
    }

    public static Map<String, Object> createOrdersIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        Locale locale = (Locale) context.get("locale");
        String solrHost = getSolrHost(delegator, "orders");
        String enterpriseSearchHost = getSolrHost(delegator, "enterpriseSearch");
        EntityListIterator eli = null;
        int unCommittedDocs = 0;
        int unCommittedDocsLimit = 100;
        if(UtilValidate.isNotEmpty(context.get("unCommittedDocsLimit"))) {
            unCommittedDocsLimit = (Integer) context.get("unCommittedDocsLimit");
        }
        try {
            HttpSolrServer server = new HttpSolrServer(solrHost);
            HttpSolrServer enterpriseSearchServer = new HttpSolrServer(enterpriseSearchHost);
            eli = delegator.find("OrderHeader", null, null, null, null, null);
            GenericValue order;
            // Solr supports yyyy-MM-dd'T'HH:mm:ss.SSS'Z' date format.
            DateFormat df = UtilDateTime.toDateTimeFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getDefault(), locale);
            while ((order = eli.next())!= null) {
                SolrDocument solrDocument = new SolrDocument();
                solrDocument.addField("orderId", order.get("orderId"));
                solrDocument.addField("orderTypeId", order.get("orderTypeId"));
                solrDocument.addField("statusId", order.get("statusId"));
                GenericValue orderItem = EntityUtil.getFirst(order.getRelated("OrderItem", null, null, false));
                if(UtilValidate.isNotEmpty(orderItem.get("correspondingPoId"))) {
                    solrDocument.addField("correspondingPoId", order.get("correspondingPoId"));
                }
                solrDocument.addField("orderDate", df.format(order.get("orderDate")));
                String roleTypeId = "BILL_TO_CUSTOMER";
                if ("PURCHASE_ORDER".equals(order.getString("orderTypeId"))) {
                    roleTypeId = "BILL_FROM_VENDOR";
                }
                GenericValue orderRole = EntityUtil.getFirst(order.getRelated("OrderRole", UtilMisc.toMap("roleTypeId", roleTypeId), null, false));
                solrDocument.addField("customer", PartyHelper.getPartyName(delegator, orderRole.getString("partyId"), false));
                solrDocument.addField("salesChannelEnumId", order.get("salesChannelEnumId"));
                SolrInputDocument doc= ClientUtils.toSolrInputDocument(solrDocument);
                server.add(doc);
                doc.addField("docType", "ORDER");
                doc.addField("identifier", order.get("orderId"));
                DateFormat dfString = UtilDateTime.toDateTimeFormat("M-d-yyyy h:mm a", TimeZone.getDefault(), locale);
                doc.addField("orderDateString", dfString.format(order.get("orderDate")));
                doc.addField("title", "Order " + order.get("orderId") + " placed by " + doc.getFieldValue("customer") + " on "+ dfString.format(order.get("orderDate")) + ".");
                enterpriseSearchServer.add(doc);
                unCommittedDocs = unCommittedDocs + 1;
                if(unCommittedDocs >= unCommittedDocsLimit) {
                    server.commit();
                    unCommittedDocs = 0;
                }
            }
            if(unCommittedDocs > 0) {
                server.commit();
            }
        } catch (GenericEntityException e){
            Debug.logError(e.getMessage(), module);
        } catch (IOException e) {
            Debug.logError(e, module);
        } catch (SolrServerException e) {
            Debug.logError(e, module);
        } finally {
            if (eli != null) {
                try {
                    eli.close();
                } catch (GenericEntityException gee) {
                    Debug.logError(gee, "Error closing EntityListIterator for finding OrderHeaders", module);
                }
            }
        }
        return ServiceUtil.returnSuccess();
    }
}

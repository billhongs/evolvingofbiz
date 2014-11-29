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

package org.ofbiz.returns;

import java.io.IOException;
import java.text.DateFormat;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilDateTime;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.enterprisesearch.SearchHelper;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.util.EntityListIterator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.party.party.PartyHelper;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.GenericServiceException;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.service.ServiceUtil;

public class ReturnServices {
    public static final String module = ReturnServices.class.getName();

    public static Map<String, Object> createReturnIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        String returnId = (String)context.get("returnId");
        Locale locale = (Locale) context.get("locale");
        String solrHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        if (UtilValidate.isNotEmpty(returnId)) {
            try {
                GenericValue returnHeader = delegator.findOne("ReturnHeader", UtilMisc.toMap("returnId", returnId), false);
                if (UtilValidate.isNotEmpty(returnHeader)) {
                    SolrInputDocument doc = new SolrInputDocument();
                    doc.addField("docType", "RETURN");
                    doc.addField("returnId", returnId);
                    doc.addField("identifier", returnId);
                    doc.addField("returnHeaderTypeId", returnHeader.getString("returnHeaderTypeId"));
                    doc.addField("statusId", returnHeader.getString("statusId"));
                    doc.addField("customer", PartyHelper.getPartyName(delegator, returnHeader.getString("fromPartyId"), false));
                 // Solr supports yyyy-MM-dd'T'HH:mm:ss.SSS'Z' date format.
                    DateFormat df = UtilDateTime.toDateTimeFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", TimeZone.getDefault(), locale);
                    doc.addField("returnDate", df.format(returnHeader.get("entryDate")));
                    GenericValue returnItem = EntityUtil.getFirst(returnHeader.getRelated("ReturnItem", null, null, false));
                    if(UtilValidate.isNotEmpty(returnItem)) {
                        String orderId = returnItem.getString("orderId");
                        doc.addField("orderId", orderId);
                        doc.addField("title", "Return "+returnId+" for order "+orderId);
                    } else {
                        doc.addField("title", "Return "+returnId); //to handle returns having no items
                    }
                    server.add(doc);
                } else {
                    Debug.logError("Return not found for indexing.", module);
                    return ServiceUtil.returnError("Return not found for indexing.");
                }
            } catch (GenericEntityException e){
                Debug.logError(e.getMessage(), module);
            } catch (IOException e) {
                Debug.logError(e, module);
            } catch (SolrServerException e) {
                Debug.logError(e, module);
            }
        }
        return ServiceUtil.returnSuccess();
    }
    public static Map<String, Object> createReturnsIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        EntityListIterator eli = null;
        try {
            eli = delegator.find("ReturnHeader", null, null, null, null, null);
            GenericValue returnHeader;
            while (UtilValidate.isNotEmpty((returnHeader = eli.next()))) {
                Map<String, Object> createReturnIndexCtx = UtilMisc.toMap("userLogin", userLogin, "returnId", returnHeader.getString("returnId"));
                dispatcher.runSync("createReturnIndex", createReturnIndexCtx);
            }
        } catch (GenericEntityException e) {
            Debug.logError(e.getMessage(), module);
        } catch (GenericServiceException e) {
            Debug.logError(e.getMessage(), module);
        } finally {
            if (UtilValidate.isNotEmpty(eli)) {
                try {
                    eli.close();
                } catch (GenericEntityException e) {
                    Debug.logError(e, "Error closing EntityListIterator for ReturnHeader", module);
                }
            }
        }
        return ServiceUtil.returnSuccess();
    }
}

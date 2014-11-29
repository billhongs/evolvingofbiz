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

package org.ofbiz.shipments;

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
import org.ofbiz.enterprisesearch.SearchHelper;
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
import org.ofbiz.service.GenericServiceException;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.service.ServiceUtil;

public class ShipmentServices {
    public static final String module = ShipmentServices.class.getName();

    public static Map<String, Object> createShipmentIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        String solrHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        String shipmentId = (String) context.get("shipmentId");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        if (UtilValidate.isNotEmpty(shipmentId)) {
            try {
                GenericValue shipment = delegator.findOne("Shipment", UtilMisc.toMap("shipmentId", shipmentId), false);
                if (UtilValidate.isNotEmpty(shipment)) {
                    SolrInputDocument doc = new SolrInputDocument();
                    doc.addField("shipmentId", shipment.getString("shipmentId"));
                    doc.addField("shipmentTypeId", shipment.getString("shipmentTypeId"));
                    doc.addField("statusId", shipment.getString("statusId"));
                    doc.addField("docType", "SHIPMENT");
                    doc.addField("identifier", shipmentId);
                    String title = "";
                    if ("SALES_SHIPMENT".equals(shipment.getString("shipmentTypeId"))) {
                        title = "Shipment " + shipment.getString("shipmentId")+" for Order "+shipment.getString("primaryOrderId")+".";
                        doc.addField("customer", PartyHelper.getPartyName(delegator, shipment.getString("partyIdTo"), false));
                        doc.addField("orderId", shipment.getString("primaryOrderId"));
                    } else if ("PURCHASE_SHIPMENT".equals(shipment.getString("shipmentTypeId"))) {
                        title = "Shipment " + shipment.getString("shipmentId")+" for Purchase Order "+shipment.getString("primaryOrderId")+".";
                        doc.addField("supplier", PartyHelper.getPartyName(delegator, shipment.getString("partyIdFrom"), false));
                        doc.addField("orderId", shipment.getString("primaryOrderId"));
                    } else {
                        title = "Shipment " + shipment.getString("shipmentId")+" for Sales Return "+shipment.getString("primaryReturnId")+".";
                        doc.addField("customer", PartyHelper.getPartyName(delegator, shipment.getString("partyIdFrom"), false));
                        doc.addField("returnId", shipment.getString("primaryReturnId"));
                    }
                    doc.addField("title", title);
                    server.add(doc);
                } else {
                    Debug.logError("Shipment not found for indexing.", module);
                    return ServiceUtil.returnError("Shipment not found for indexing.");
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

    public static Map<String, Object> createShipmentsIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        EntityListIterator eli = null;
        try {
            eli = delegator.find("Shipment", null, null, null, null, null);
            GenericValue shipment;
            while ((shipment = eli.next())!= null) {
                Map<String, Object> createShipmentIndexCtx = UtilMisc.toMap("userLogin", userLogin, "shipmentId", shipment.getString("shipmentId"));
                dispatcher.runSync("createShipmentIndex", createShipmentIndexCtx);
            }
        } catch (GenericEntityException e) {
            Debug.logError(e.getMessage(), module);
        } catch (GenericServiceException e) {
            Debug.logError(e.getMessage(), module);
        } finally {
            if (eli != null) {
                try {
                    eli.close();
                } catch (GenericEntityException e) {
                    Debug.logError(e, "Error closing EntityListIterator for Shipments", module);
                }
            }
        }
        return ServiceUtil.returnSuccess();
    }
}

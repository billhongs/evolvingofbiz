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

package org.ofbiz.customers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.enterprisesearch.SearchHelper;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.util.EntityListIterator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.party.contact.ContactMechWorker;
import org.ofbiz.party.party.PartyHelper;
import org.ofbiz.party.party.PartyWorker;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.GenericServiceException;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.service.ServiceUtil;

public class CustomerServices {
    public static final String module = CustomerServices.class.getName();
    public static SolrInputDocument createDocForParty(Delegator delegator, LocalDispatcher dispatcher, GenericValue party, GenericValue userLogin) {
        SolrInputDocument doc = new SolrInputDocument();
        try {
            String partyId = party.getString("partyId");
            doc.addField("partyId", partyId);
            doc.addField("partyTypeId", party.getString("partyTypeId"));
            doc.addField("statusId", party.getString("statusId"));

            List<Map<String, Object>> partyContactNumberList = ContactMechWorker.getPartyContactMechValueMaps(delegator, partyId, false, "TELECOM_NUMBER");
            List<String> contactNumberList = new ArrayList<String>();
            for (Map<String, Object> partyContactNumberMap : partyContactNumberList) {
                GenericValue telecomNumber = (GenericValue) partyContactNumberMap.get("telecomNumber");
                String contactNumber = telecomNumber.getString("countryCode") +"-"+ telecomNumber.getString("areaCode") +"-"+ telecomNumber.getString("contactNumber");
                contactNumberList.add(contactNumber);
                doc.addField("contactNumber", contactNumber);
            }

            Map<String, Object> result = new HashMap<String, Object>();
            result = dispatcher.runSync("getPartyEmail", UtilMisc.toMap("partyId", partyId, "userLogin", userLogin));
            doc.addField("emailAddress", result.get("emailAddress"));
            String partyName = PartyHelper.getPartyName(delegator, partyId, false);
            doc.addField("partyName", partyName);

            GenericValue partyUserLogin = PartyWorker.findPartyLatestUserLogin(partyId, delegator);
            if(UtilValidate.isNotEmpty(partyUserLogin)) {
                doc.addField("userLoginId", partyUserLogin.getString("userLoginId"));
            }

            List<GenericValue> partyRole = party.getRelated("PartyRole", null, null, false);
            for (GenericValue role : partyRole) {
                doc.addField("roleTypeId", role.getString("roleTypeId"));
                if("CUSTOMER".equals(role.getString("roleTypeId"))) {
                    doc.addField("docType", "CUSTOMER");
                    doc.addField("identifier", partyId);
                    String title = "Customer " + partyName;
                    if(UtilValidate.isNotEmpty(result.get("emailAddress"))) {
                        title = title + " ("+ result.get("emailAddress") +")";
                    }
                    if(UtilValidate.isNotEmpty(contactNumberList)) {
                        String contactNumberString = null;
                        for (String contactNumber : contactNumberList) {
                            if(UtilValidate.isNotEmpty(contactNumberString)) {
                                contactNumberString = contactNumberString + "," + contactNumber;
                            } else {
                                contactNumberString = contactNumber;
                            }
                        }
                        title = title +  ", contact number: " + contactNumberString;
                    }
                    doc.addField("title", title + ".");
                } else if("APPLICATION_USER".equals(role.getString("roleTypeId"))){
                    doc.addField("docType", "APPLICATION_USER");
                    doc.addField("identifier", partyId);
                    String title = "User " + partyName;
                    if(UtilValidate.isNotEmpty(result.get("emailAddress"))) {
                        title = title + " ("+ result.get("emailAddress") +")";
                    }
                    doc.addField("title", title + ".");
                }
                if(UtilValidate.isNotEmpty(doc.get("docType"))) {
                    break;
                }
            }
        } catch (GenericEntityException e) {
            Debug.logError(e, module);
        } catch (GenericServiceException e) {
            Debug.logError(e.toString(), module);
        }

        return doc;
    }

    public static Map<String, Object> createPartyIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        String solrHost = SearchHelper.getSolrHost(delegator, "party");
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        String partyId = (String) context.get("partyId");
        String contactMechId = (String) context.get("contactMechId");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        String enterpriseSearchHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        HttpSolrServer enterpriseSearchServer = new HttpSolrServer(enterpriseSearchHost);
        if (UtilValidate.isNotEmpty(partyId) || UtilValidate.isNotEmpty(contactMechId)) {
            try {
                GenericValue party = null;
                if (UtilValidate.isNotEmpty(partyId)) {
                    party = delegator.findOne("Party", UtilMisc.toMap("partyId", partyId), false);
                } else {
                    GenericValue partyContactMech = EntityUtil.getFirst(delegator.findByAnd("PartyContactMech", UtilMisc.toMap("contactMechId", contactMechId), null, false));
                    if (UtilValidate.isNotEmpty(partyContactMech)) {
                        party = partyContactMech.getRelatedOne("Party", false);
                    }
                }

                if (UtilValidate.isEmpty(userLogin)) {
                    userLogin = delegator.findOne("UserLogin", UtilMisc.toMap("userLoginId", "system"), false);
                }
                if (UtilValidate.isNotEmpty(party)) {
                    SolrInputDocument doc= createDocForParty(delegator, dispatcher, party, userLogin);
                    if(UtilValidate.isNotEmpty(doc.get("docType"))) {
                        enterpriseSearchServer.add(doc);
                        doc.removeField("title");
                        doc.removeField("docType");
                        doc.removeField("identifier");
                    }
                    server.add(doc);
                    server.commit();
                } else {
                    Debug.logError("Party not found for indexing.", module);
                    return ServiceUtil.returnError("Party not found for indexing.");
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

    public static Map<String, Object> createPartiesIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        String solrHost = SearchHelper.getSolrHost(delegator, "party");
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        String enterpriseSearchHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        HttpSolrServer enterpriseSearchServer = new HttpSolrServer(enterpriseSearchHost);

            EntityListIterator eli = null;
            try {
                int unCommittedDocs = 0;
                int unCommittedDocsLimit = 100;
                if(UtilValidate.isNotEmpty(context.get("unCommittedDocsLimit"))) {
                    unCommittedDocsLimit = (Integer) context.get("unCommittedDocsLimit");
                }

                eli = delegator.find("Party", null, null, null, null, null);
                GenericValue party= null;
                while ((party = eli.next())!= null) {
                    SolrInputDocument doc = createDocForParty(delegator, dispatcher, party, userLogin);
                    if(UtilValidate.isNotEmpty(doc.get("docType"))) {
                        enterpriseSearchServer.add(doc);
                        doc.removeField("title");
                        doc.removeField("docType");
                        doc.removeField("identifier");
                    }
                    server.add(doc);
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
                        ServiceUtil.returnError("Error closing EntityListIterator for finding Party.");
                    }
                }
        }
        return ServiceUtil.returnSuccess();
    }
}
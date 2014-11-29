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

package org.ofbiz.products;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javolution.util.FastList;
import javolution.util.FastMap;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.util.EntityListIterator;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.enterprisesearch.SearchHelper;
import org.ofbiz.party.party.PartyHelper;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.service.ServiceUtil;

public class ProductServices {
    public static final String module = ProductServices.class.getName();

    public static Map<String, Object> createProductIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        String solrHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        String productId = (String) context.get("productId");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        try {
            GenericValue product = delegator.findOne("Product", false, "productId", productId);
            if (UtilValidate.isNotEmpty(product)) {
                SolrInputDocument doc= createDocForProduct(delegator, dispatcher, product);
                server.add(doc);
            } else {
                Debug.logError("Product not found for indexing.", module);
                return ServiceUtil.returnError("Product not found for indexing.");
            }
        } catch (GenericEntityException e){
            Debug.logError(e.getMessage(), module);
        } catch (IOException e) {
            Debug.logError(e, module);
        } catch (SolrServerException e) {
            Debug.logError(e, module);
        }
        return ServiceUtil.returnSuccess();
    }

    public static Map<String, Object> createProductsIndex(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        LocalDispatcher dispatcher = dctx.getDispatcher();
        String solrHost = SearchHelper.getSolrHost(delegator, "enterpriseSearch");
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        HttpSolrServer server = new HttpSolrServer(solrHost);
        
            EntityListIterator eli = null;
            try {
                int unCommittedDocs = 0;
                int unCommittedDocsLimit = 100;
                if(UtilValidate.isNotEmpty(context.get("unCommittedDocsLimit"))) {
                    unCommittedDocsLimit = (Integer) context.get("unCommittedDocsLimit");
                }

                eli = delegator.find("Product", null, null, null, null, null);
                GenericValue product= null;
                while ((product = eli.next())!= null) {
                    SolrInputDocument doc = createDocForProduct(delegator, dispatcher, product);
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
                        ServiceUtil.returnError("Error closing EntityListIterator for finding Product.");
                    }
                }
        }
        return ServiceUtil.returnSuccess();
    }

    public static SolrInputDocument createDocForProduct(Delegator delegator, LocalDispatcher dispatcher, GenericValue product) throws GenericEntityException  {
        SolrInputDocument doc = new SolrInputDocument();
        String productId = product.getString("productId");
        doc.addField("productId", productId);
        doc.addField("productTypeId", product.getString("productTypeId"));
        if(UtilValidate.isNotEmpty(product.getString("productName"))) {
            doc.addField("productName", product.getString("productName"));
        } else {
            doc.addField("productName", productId);
        }
        doc.addField("internalName", product.getString("internalName"));
        doc.addField("brandName", product.getString("brandName"));
        doc.addField("description", product.getString("description"));
        doc.addField("longDescription", product.getString("longDescription"));
        doc.addField("introductionDate", product.get("introductionDate"));
        doc.addField("salesDiscontinuationDate", product.get("salesDiscontinuationDate"));
        if(UtilValidate.isNotEmpty(product.get("isVariant")) && product.getBoolean("isVariant")){
            doc.addField("isVariant", true);
        } else {
            doc.addField("isVariant", false);
        }
        
        if ("Y".equals(product.getString("isVirtual"))) {
            List<GenericValue> variantProductAssocs = delegator.findByAnd("ProductAssoc", UtilMisc.toMap("productId", productId, "productAssocTypeId", "PRODUCT_VARIANT"), null, false);
            variantProductAssocs = EntityUtil.filterByDate(variantProductAssocs);
            for (GenericValue variantProductAssoc: variantProductAssocs) {
                doc.addField("variantProductId", variantProductAssoc.get("productIdTo"));
            }
        }
        
        List<GenericValue> productPrices = product.getRelated("ProductPrice", null, null, false);
        productPrices = EntityUtil.filterByDate(productPrices);
        for (GenericValue productPrice : productPrices) {
            StringBuilder fieldNameSb = new StringBuilder();
            fieldNameSb.append(productPrice.getString("productPriceTypeId"));
            fieldNameSb.append('_');
            fieldNameSb.append(productPrice.getString("productPricePurposeId"));
            fieldNameSb.append('_');
            fieldNameSb.append(productPrice.getString("currencyUomId"));
            fieldNameSb.append('_');
            fieldNameSb.append(productPrice.getString("productStoreGroupId"));
            fieldNameSb.append("_price");
            doc.addField(fieldNameSb.toString(), productPrice.getString("price"));
            }
        
        /* Following code doesn't useful as the entity used here doesn't exists. Please remove this code before committing this code.
         * List<String> websiteIds = EntityUtil.getFieldListFromEntityList(delegator.findByAnd("WebSiteProductPageContent", UtilMisc.toMap("productId", productId, "statusId", "CTNT_PUBLISHED"), null, false), "webSiteId", true);
        for (String webSiteId : websiteIds) {
            doc.addField("webSiteId", webSiteId);
        }*/
        
        List<GenericValue> productAttributes = delegator.findByAnd("ProductAttribute", UtilMisc.toMap("productId", productId), null, false);
        for (GenericValue productAttribute: productAttributes) {
            doc.addField("attributeName", productAttribute.getString("attrName"));
            doc.addField("attributeValue", productAttribute.getString("attrValue"));
        }

        List<Map<String, Object>> supplierProducts = getProductSuppliers(delegator, productId);
        for (Map<String, Object> supplierPartyId : supplierProducts) {
            doc.addField("supplierPartyId", supplierPartyId);
        }

        Set<String>indexedCategoryIds = new HashSet<String>();
        List<GenericValue> categories = getCurrentProductCategories(product);
        for (GenericValue category: categories) {
            String productCategoryId = category.getString("productCategoryId");
            doc.addField("productCategories", productCategoryId);
            doc.addField("directProductCategoryId", productCategoryId);
            indexedCategoryIds.add(productCategoryId);
            getParentCategories(doc, category, indexedCategoryIds);
        }
        
        doc.addField("docType", "PRODUCT");
        doc.addField("identifier", productId);
        String title = "Product " + product.getString("productName");
        if(UtilValidate.isNotEmpty(product.getString("description"))) {
            title = title + ", "+ product.getString("description");
        }
        doc.addField("title", title + ".");
        return doc;
    }

    public static void getParentCategories(SolrInputDocument doc, GenericValue productCategory, Set<String> indexedCategoryIds) throws GenericEntityException {
        List<GenericValue> productCategoryRollups = productCategory.getRelated("CurrentProductCategoryRollup", null, null, false);
        productCategoryRollups = EntityUtil.filterByDate(productCategoryRollups);
        for (GenericValue productCategoryRollup : productCategoryRollups) {
            if (!indexedCategoryIds.add(productCategoryRollup.getString("parentProductCategoryId"))) {
                continue;
            }
            GenericValue parentProductCategory = productCategoryRollup.getRelatedOne("ParentProductCategory", false);
            doc.addField("productCategories", parentProductCategory.getString("productCategoryId"));
        }
    }
    
    public static List<Map<String, Object>> getProductSuppliers(Delegator delegator, String productId) {
        List<Map<String, Object>> supplierProductList = FastList.newInstance();
        if (UtilValidate.isNotEmpty(productId)) {
            try {
                List<GenericValue> supplierProducts = delegator.findByAnd("SupplierProductAndProduct", UtilMisc.toMap("productId", productId), null, false);
                for (GenericValue supplierProduct : supplierProducts) {
                    String supplierName = PartyHelper.getPartyName(delegator, supplierProduct.getString("partyId"), false);
                    Map<String, Object> supplierProductmap = FastMap.newInstance();
                    supplierProductmap.put("partyId", supplierProduct.getString("partyId"));
                    supplierProductmap.put("groupName", supplierName);
                    supplierProductmap.put("supplierProductName", supplierProduct.getString("supplierProductName"));
                    supplierProductmap.put("supplierProductId", supplierProduct.getString("supplierProductId"));
                    supplierProductmap.put("productName", supplierProduct.getString("productName"));
                    supplierProductList.add(supplierProductmap);
                }
            } catch (GenericEntityException e) {
                Debug.logError(e, module);
            } catch (Exception e) {
                Debug.logError(e, module);
            }
        }
        return supplierProductList;
    }
    public static List<GenericValue> getCurrentProductCategories(GenericValue product) {
        if (product == null) {
            return null;
        }
        List<GenericValue> categories = FastList.newInstance();
        try {
            List<GenericValue> categoryMembers = product.getRelated("ProductCategoryMember", null, null, false);
            categoryMembers = EntityUtil.filterByDate(categoryMembers);
            categories = EntityUtil.getRelated("ProductCategory", null, categoryMembers, false);
        } catch (GenericEntityException e) {
            Debug.logError(e, module);
        }
        return categories;
    }
}

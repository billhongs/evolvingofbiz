import org.ofbiz.entity.util.EntityUtil;

import org.ofbiz.entity.condition.EntityConditionBuilder;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.common.SolrDocument;
import org.noggit.CharArr;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.content.search.DocumentIndexer;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.util.ClientUtils;

import com.hotwaxmedia.easyerpadmin.StoreWorker;


def getProductSearchFacets () {
    result = [];
    HttpSolrServer server = new HttpSolrServer(DocumentIndexer.getSolrHost(delegator, "enterpriseSearch"));
    SolrQuery query = new SolrQuery();
    facetCategories = [];
    productList = [] as Set;
    keyword = parameters.keyword?.trim() ?: "";
    keyword = ClientUtils.escapeQueryChars(keyword);
    
    prodCatalogCategories = delegator.findList("ProdCatalogCategory", null, null, null, null, false);
    exprBldr = new EntityConditionBuilder();
    categoryCondition = exprBldr.AND() {
        EQUALS(productCategoryTypeId : "CATALOG_CATEGORY");
        NOT_IN(productCategoryId : prodCatalogCategories.productCategoryId);
    }
    allCategories = delegator.findList("ProductCategory", categoryCondition, null, ["categoryName"], null, false);
    
    // calculation of facets
    query.setParam("q", "*:*");
    query.addFilterQuery("fullText:*" + keyword + "* OR " + "productId:*" + keyword + "*");
    query.addFilterQuery("productTypeId:FINISHED_GOOD")
    query.addFilterQuery("isVariant:false");
    if(parameters.webSiteId) {
        query.addFilterQuery("webSiteId:" + parameters.webSiteId);
    }
    query.setFacet(true);

    //category facets for getting the count of product in each category.
    allCategories.each { category ->
        query.addFacetQuery("productCategories:" + category.productCategoryId);
    }
    // price filteration for getting the category's product count based on price range.
    if(parameters.price){
        price_range = parameters.price.split(":");
        if(price_range.length == 1) {
            query.addFilterQuery("DEFAULT_PRICE_PURCHASE_USD__NA__price:["+ price_range[0] + " TO *]");
        } else{
            query.addFilterQuery("DEFAULT_PRICE_PURCHASE_USD__NA__price:["+ price_range[0] + " TO " + price_range[1] +"]");
        }
    }
    
    QueryRequest qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    QueryResponse rsp = qryReq.process(server);
    Map<String, Integer> facetQuery = rsp.getFacetQuery();
    
    searchedCategoriesString = parameters.cat;
    searchedCategories = searchedCategoriesString?.split(":");
    
    if(parameters.keyword){
        urlParam = "keyword=" + keyword + "&cat=";
    } else {
        urlParam = "cat=";
    }
    
    // Category URL parameters calculation
    allCategories.each { category ->
        categoryInfo = [:];
        catParam = urlParam;
        checked = true;
        productCategoryCount= facetQuery.get("productCategories:" + category.productCategoryId);
        if(productCategoryCount > 0 || searchedCategories?.contains(category.productCategoryId)) {
            categoryInfo.categoryName = category.categoryName;
            categoryInfo.productCategoryId = category.productCategoryId;
            categoryInfo.productCategoryCount = productCategoryCount;
    
            if(searchedCategories){
                urlCategories = [];
                searchedCategories.each { searchCategory ->
                    if(searchCategory){
                        if(!(searchCategory.equals(category.productCategoryId))){
                            urlCategories.add(searchCategory);
                        }
                    }
                }
                urlCategories.each { urlCat->
                    catParam = catParam + ":"+ urlCat;
                }
                if(!(searchedCategories.contains(category.productCategoryId))) {
                    checked = false;
                    catParam = catParam + ":"+ category.productCategoryId;
                }
            } else {
                catParam = catParam + category.productCategoryId;
            }
            if(parameters.price){
                catParam = catParam + "&price=" + parameters.price;
            }
            categoryInfo.checked = checked;
            categoryInfo.urlParam = catParam;
            facetCategories.add(categoryInfo);
        }
    }
    result.clearCatUrl = urlParam + (parameters.price ? "&price=" + parameters.price : "");
    
    //price facets
    query.clear();
    query.setParam("q", "*:*");
    query.addFilterQuery("fullText:*" + keyword + "* OR " + "productId:*" + keyword + "*");
    query.addFilterQuery("productTypeId:FINISHED_GOOD");
    query.addFilterQuery("isVariant:false");
    if(parameters.webSiteId) {
        query.addFilterQuery("webSiteId:" + parameters.webSiteId);
    }
    query.setFacet(true);
    query.setRows(30);
    allPricesRange = ["0:299", "300:599", "600:899","900:1199", "1200"];
    allPricesRange.each { priceRange ->
        price_range = priceRange.split(":");
        if(price_range.length == 1) {
            query.addFacetQuery("DEFAULT_PRICE_PURCHASE_USD__NA__price:[" + price_range[0] + " TO *]");
        } else{
            query.addFacetQuery("DEFAULT_PRICE_PURCHASE_USD__NA__price:[" + price_range[0] + " TO "+ price_range[1]+"]");
        }
    }
    
    queryString = "";
    priceUrlCatParam = urlParam;
    if(searchedCategories){
        searchedCategories.each { searchCategory ->
            if(searchCategory){
                if(queryString) {
                    queryString = queryString +" OR " + searchCategory;
                } else {
                    queryString = searchCategory;
                }
                priceUrlCatParam = priceUrlCatParam + ":" + searchCategory;
            }
        }
        if (queryString){
            query.addFilterQuery("productCategories:" + "(" + queryString +")");
        }
    }
    
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    facetQuery = rsp.getFacetQuery();
    facetPriceRanges = [];
    
    result.clearPriceUrl = priceUrlCatParam;
    
    allPricesRange.each { priceRange ->
        priceInfo = [:];
        price_range = priceRange.split(":");
        if(price_range.length == 1) {
            priceRangeCount= facetQuery.get("DEFAULT_PRICE_PURCHASE_USD__NA__price:[" + price_range[0] + " TO *]");
        } else{
            priceRangeCount= facetQuery.get("DEFAULT_PRICE_PURCHASE_USD__NA__price:[" + price_range[0] + " TO "+ price_range[1] + "]");
        }
        if(priceRangeCount > 0) {
        priceUrlParam = priceUrlCatParam;
            priceInfo.priceRange = priceRange;
            priceInfo.priceRangeCount = priceRangeCount;
            if(price_range.length == 1) {
                priceInfo.priceRangeName =  price_range[0] + " and Above";
            } else{
                priceInfo.priceRangeName =  price_range[0] + " - " + price_range[1];
            }
            if(parameters.price){
                if(!parameters.price.equals(priceRange)){
                    priceUrlParam = priceUrlParam + "&price=" + priceRange;
                }
            } else {
                priceUrlParam = priceUrlParam + "&price=" + priceRange;
            }
            priceInfo.urlParam = priceUrlParam;
            facetPriceRanges.add(priceInfo);
        }
    }
    result.facetCategories = facetCategories;
    result.facetPriceRanges = facetPriceRanges;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}

def getProductSearchResults () {
    result = [];
    HttpSolrServer server = new HttpSolrServer(DocumentIndexer.getSolrHost(delegator, "enterpriseSearch"));
    SolrQuery query = new SolrQuery();
    
    // filtered queries on facets.
    keyword = parameters.keyword?.trim() ?: "";
    keyword = ClientUtils.escapeQueryChars(keyword);
    viewSize = Integer.valueOf(parameters.viewSize ?: 30);
    viewIndex = Integer.valueOf(parameters.viewIndex ?: 0);
    productList = [] as Set;
    
    query.setParam("q", "*:*");
    query.addFilterQuery("fullText:*" + keyword + "* OR " + "productId:*" + keyword + "*");
    query.addFilterQuery("productTypeId:FINISHED_GOOD");
    query.addFilterQuery("isVariant:false");
    if(parameters.webSiteId) {
        query.addFilterQuery("webSiteId:" + parameters.webSiteId);
    }
    queryString = "";
    
    if(parameters.keyword){
        completeUrl = "keyword="+ keyword + "&cat=";
    } else {
        completeUrl = "cat=";
    }
    if(parameters.cat) {
        searchedCategoriesString = parameters.cat;
        searchedCategories = searchedCategoriesString.split(":");
        searchedCategories.each { category ->
            if(category) {
                if(queryString) {
                    queryString = queryString + " OR " + category;
                } else {
                    queryString = category;
                }
                completeUrl = completeUrl + ":" + category;
            }
        }
    }
    productStore = null;
    try {
        // TODO : For now hardcoding the product store, considering that there is only one store. When we work on multi store we need to improve this method.
        String productStoreId = "9000";
        productStore = delegator.findOne("ProductStore", false, UtilMisc.toMap("productStoreId", productStoreId));
    } catch (GenericEntityException gee) {
        Debug.logError(gee, gee.getMessage(),module);
        return null;
    }
    if(parameters.price){
        price_range = parameters.price.split(":");
        if(price_range.length == 1) {
            query.addFilterQuery("DEFAULT_PRICE_PURCHASE_"+ productStore.defaultCurrencyUomId +"__NA__price:[" + price_range[0] + " TO *]");
        } else{
            query.addFilterQuery("DEFAULT_PRICE_PURCHASE_"+ productStore.defaultCurrencyUomId +"__NA__price:[" + price_range[0] + " TO "+ price_range[1] +"]");
        }
        completeUrl = completeUrl + "&price="+ parameters.price;;
    }

    if (queryString){
        query.addFilterQuery("productCategories:(" + queryString + ")");
    }
    QueryRequest qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    QueryResponse rsp = qryReq.process(server);
    listSize = Integer.valueOf(rsp.getResults().getNumFound().toString());

    paginationValues = SearchHelper.getPaginationValues(viewSize, viewIndex, listSize);
    query.setRows(viewSize);
    query.setStart(paginationValues.get('lowIndex') - 1);
    qryReq = new QueryRequest(query, SolrRequest.METHOD.POST);
    rsp = qryReq.process(server);
    SolrDocumentList docs = rsp.getResults();
    for (SolrDocument doc : docs) {
        productList.add((String) doc.get("productId"));
    }
    productAndPriceList = [];
    productList.each { productId ->
        productAndPrice = [:];
        product = delegator.findOne("Product", [productId: productId], false);
        productPrice = EntityUtil.getFirst(delegator.findByAnd("ProductPrice", [productId: productId, productPriceTypeId:"DEFAULT_PRICE", currencyUomId: productStore.defaultCurrencyUomId]));
        productAndPrice.productId = productId;
        productAndPrice.productName = product?.productName;
        productAndPrice.price = productPrice?.price;
        productAndPriceList.add(productAndPrice);
    }
    result.productAndPriceList = productAndPriceList;
    result.completeUrl = completeUrl;
    result.viewIndex = viewIndex;
    result.viewSize = viewSize;
    result.lowIndex = paginationValues.get("lowIndex");
    result.listSize = listSize;
    result.productList = productList;
    serviceResult = ServiceUtil.returnSuccess();
    serviceResult.put("result", result);
    return serviceResult;
}
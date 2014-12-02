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

package org.ofbiz.enterprisesearch;

import java.util.Map;

import javolution.util.FastMap;

import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;

public class SearchHelper {
    public static final String module = SearchHelper.class.getName();

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
}

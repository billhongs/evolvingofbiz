<#--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

<section class="well well-sm">
  <form method="get" action="<@ofbizUrl>ListExamples</@ofbizUrl>" class="ajaxMe" data-successMethod="#main-page" data-errorMethod="#main-page">
    <input type="hidden" name="showAll" value="Y" />
    <div class="form-group row">
      <div class="col-lg-12 col-md-12">
        <input type="text" class="form-control" value="${parameters.keyword?if_exists}" name="keyword" placeholder="${uiLabelMap.CommonSearch}"/>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-lg-12 col-md-12">
        <button class="btn btn-primary relative" type="submit">${uiLabelMap.CommonFind}
          <span class="ajax-loader abs" style="display:none"></span>
        </button>
      </div>
    </div>
  </form>
  <#if facetExampleTypes?has_content>
    <div class="row">
      <div class="col-lg-12">
        <div class="thumbnail">
          <div class="facets-nav-header">
            <h4><span>${uiLabelMap.CommonType}</span><#if parameters.exampleType?has_content><a class="pull-right label label-default" href="<@ofbizUrl>FindExample</@ofbizUrl>?${clearExampleTypeUrl}" data-update-url="<@ofbizUrl>ListExamples</@ofbizUrl>?${clearExampleTypeUrl}" data-ajax-update="#main-page"><span class="h5">${uiLabelMap.CommonClear}</span></a></#if></h4>
          </div>
          <div style="max-height:205px;overflow:auto">
            <#list facetExampleTypes as exampleType>
              <div class="checkbox">
                <label for="exampleType">
                  <input type="checkbox" value="${exampleType.exampleTypeId}" data-click-navigation=".exampleType_${exampleType_index}" <#if parameters.exampleType?has_content><#if exampleType.checked!>checked</#if></#if>>
                  <a href="<@ofbizUrl>FindExample</@ofbizUrl>?${exampleType.urlParam}" class="exampleType_${exampleType_index}" data-update-url="<@ofbizUrl>ListExamples</@ofbizUrl>?${exampleType.urlParam}" data-ajax-update="#main-page">
                    <#if exampleType.description?exists>${exampleType.description}<#else>${exampleType.exampleTypeId}</#if> (${exampleType.exampleTypeCount?if_exists})
                  </a>
                </label>
              </div>
            </#list>
          </div>
        </div>
      </div>
    </div>
  </#if>
  <#if facetExampleStatuses?has_content>
    <div class="row">
      <div class="col-lg-12">
        <div class="thumbnail">
          <div class="facets-nav-header">
            <h4><span>${uiLabelMap.CommonStatus}</span><#if parameters.statusId?has_content><a class="pull-right label label-default" href="<@ofbizUrl>FindExample</@ofbizUrl>?${clearStatusUrl}" data-update-url="<@ofbizUrl>ListExamples</@ofbizUrl>?${clearStatusUrl}" data-ajax-update="#main-page"><span class="h5">${uiLabelMap.CommonClear}</span></a></#if></h4>
          </div>
          <div class="form-group row">
            <div class="col-lg-12 col-md-12">
              <#list facetExampleStatuses as exampleStatus>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" value="${exampleStatus.statusId}" data-click-navigation=".exampleStatus_${exampleStatus_index}" <#if parameters.statusId?has_content><#if exampleStatus.checked!>checked</#if></#if>>
                    <a href="<@ofbizUrl>FindExample</@ofbizUrl>?${exampleStatus.urlParam}" class="exampleStatus_${exampleStatus_index}" data-update-url="<@ofbizUrl>ListExamples</@ofbizUrl>?${exampleStatus.urlParam}" data-ajax-update="#main-page">
                      <#if exampleStatus.statusDesc?exists>${exampleStatus.statusDesc}<#else>${exampleStatus.statusId}</#if> (${exampleStatus.exampleStatusCount?if_exists})
                    </a>
                  </label>
                </div>
              </#list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </#if>
</section>
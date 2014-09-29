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

<div class="col-lg-3 col-md-3">
  <#include "FindExample.ftl"/>
</div>
<div class="col-lg-9 col-md-9">
  <section class="well well-sm">
    <h4>${uiLabelMap.CommonSearchResults}</h4>
    <#if exampleDetailList?has_content>
      <ul id="examples" <#if listSize?has_content && listSize &gt; viewSize> class="scrollPagination list-unstyled row" data-no-more-result="#no-more-ajax-example" data-loading-result="#loading-ajax-example" scrollpagination="enabled" data-content-page="ListFilteredExamples?${completeUrl?if_exists}" data-view-size="${viewSize}" data-view-index="${viewIndex}" data-list-size="${listSize}" data-scroll-ready="true" data-form-id=""<#else>class="thumbnails list-unstyled row"</#if>>
        <#include "ListFilteredExamples.ftl"/>
      </ul>
      <a href="#top" class="top-link">${uiLabelMap.ExampleTopOfPage}</a>
    <#else>
      <h5>${uiLabelMap.ExampleNoKeywordMatchesTheSearchCriteria}</h5>
    </#if>
      <#if listSize &gt; viewSize>
        <div class="alert alert-info loading" id="loading-ajax-example">${uiLabelMap.ExampleLoading}</div>
        <div class="alert alert-info loading" id="no-more-ajax-example">${uiLabelMap.ExampleNoMoreResults}</div>
      </#if>
  </section>
</div>
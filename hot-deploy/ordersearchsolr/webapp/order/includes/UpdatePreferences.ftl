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

<#assign thisApp = ""/>
<#assign thisAppMenu = ""/>
<#list "${parameters.userPrefTypeId}"?split("-") as splitPref>
  <#if splitPref_index==0>
    <#assign thisApp = splitPref/>
  <#else>
    <#assign thisAppMenu = splitPref/>
  </#if>
</#list>
<#assign thisAppUrl = "/"+thisApp + "/control/"/>

<#assign isFavourite><#if preferenceTypes.contains(parameters.userPrefTypeId)>show-menu<#else>hide-menu</#if></#assign>
<#assign isNotFavourite><#if preferenceTypes.contains(parameters.userPrefTypeId)>hide-menu<#else>show-menu</#if></#assign>
  <a class="${thisApp} tile filter-items-menus ${isFavourite}" href="${thisAppUrl}${thisAppMenu}?externalLoginKey=${parameters.externalLoginKey?if_exists}"><div class="text4">${parameters.userPrefValue?if_exists}</div>
<#if preferenceTypes.contains(parameters.userPrefTypeId)>
  <button type="submit"  class="btn btn-default btn-sm abs abs-top fa-bg abs-right ${isNotFavourite} rgb-fav"
     data-ajax-update=".${parameters.userPrefTypeId}" data-param-source="#${parameters.userPrefTypeId}" data-update-url="removeUserPreference">
     <i class="fa fa-star fa-2x"></i>
  </button>
<#else>
  <button type="submit"  class="btn btn-default btn-sm abs abs-top fa-bg abs-right ${isNotFavourite} rgb-fav"
     data-ajax-update=".${parameters.userPrefTypeId}" data-param-source="#${parameters.userPrefTypeId}" data-update-url="setUserPreference">
     <i class="fa fa-star-o fa-2x"></i>
  </button>
</#if>

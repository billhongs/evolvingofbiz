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

<#assign useMultitenant = Static["org.ofbiz.base.util.UtilProperties"].getPropertyValue("general.properties", "multitenant")>
<#assign username = requestParameters.USERNAME?default((sessionAttributes.autoUserLogin.userLoginId)?default(""))>
<div class="panel panel-default">
  <div class="panel-heading">
    <span class="panel-title">${uiLabelMap.CommonRegistered}</span>
  </div>
  <div class="panel-body">
  <form method="post" action="<@ofbizUrl>login</@ofbizUrl>" class="form-vertical">
    <#-- assuming that javascript will always be enabled -->
    <input type="hidden" name="JavaScriptEnabled" value="Y"/>
    <div class="row">
      <div class="col-lg-6 col-md-7 col-sm-8">
        <div class="form-group">
          <label for="username">${uiLabelMap.ExampleEmailAddress}</label>
            <input type="text" name="USERNAME" id="username" value="${username}" class="form-control" <#if username == "">autofocus</#if>/>
        </div>
        <div class="form-group">
          <label for="password">${uiLabelMap.CommonPassword}</label>
            <input type="password" name="PASSWORD" id="password" class="form-control" <#if username != "">autofocus</#if>/>
        </div>
        <#if ("Y" == useMultitenant)>
          <#if !requestAttributes.tenantId?exists>
            <div class="form-group">
              <label for="tenant">${uiLabelMap.CommonTenantId}</label>
                <input type="text" name="tenantId" for="tenant" class="form-control" value="${parameters.tenantId?if_exists}"/>
            </div>
          <#else>
            <input type="hidden" name="tenantId" value="${requestAttributes.tenantId?if_exists}"/>
          </#if>
        </#if>
        <button type="submit" class="btn btn-primary">${uiLabelMap.CommonLogin}</button>
      </div>
    </div>
  </form>
  </div>
</div>
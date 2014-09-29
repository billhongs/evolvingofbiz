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

<#assign username = requestParameters.USERNAME?default((sessionAttributes.autoUserLogin.userLoginId)?default(""))>
<#assign tenantId = requestParameters.tenantId!>
<div class="panel panel-default">
  <div class="panel-heading">
    <span class="panel-title">${uiLabelMap.ExamplePleaseResetYourPassword}</span>
  </div>
  <div class="panel-body">
    <form method="post" action="<@ofbizUrl>login</@ofbizUrl>" class="form-vertical requireValidation">
      <input type="hidden" name="requirePasswordChange" value="Y"/>
      <input type="hidden" name="USERNAME" value="${username}"/>
      <input type="hidden" name="tenantId" value="${tenantId!}"/>
      <div class="form-group row">
        <div class="col-lg-3 col-md-3">
          <label for="userName">${uiLabelMap.CommonUsername}</label>
          <input type="text" id="userName" name="userName" class="form-control" value="${username}" readOnly/>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-lg-3 col-md-3">
          <label for="password">${uiLabelMap.CommonCurrentPassword}</label>
          <input type="password" id="password" name="PASSWORD" class="required form-control" data-label="${uiLabelMap.CommonCurrentPassword}" value=""/>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-lg-3 col-md-3">
          <label for="newPassword">${uiLabelMap.CommonNewPassword}</label>
          <input type="password" id="newPassword" name="newPassword" class="required form-control" data-label="${uiLabelMap.CommonNewPassword}" value=""/>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-lg-3 col-md-3">
          <label for="newPasswordVerify">${uiLabelMap.CommonNewPasswordVerify}</label>
          <input type="password" id="newPasswordVerify" name="newPasswordVerify" class="required form-control" data-label="${uiLabelMap.CommonNewPasswordVerify}" value=""/>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-lg-3 col-md-3">
          <button type="submit" class="btn btn-primary">${uiLabelMap.CommonSave}</button>
        </div>
      </div>
    </form>
  </div>
</div>
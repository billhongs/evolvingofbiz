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

<div class="panel panel-default">
  <div class="panel-heading">
    <span class="panel-title">${uiLabelMap.CommonForgotYourPassword}</span>
  </div>
  <div class="panel-body">
    <form method="post" action="<@ofbizUrl>forgotPassword${previousParams?if_exists}</@ofbizUrl>" name="forgotPassword" class="form-vertical requireValidation">
      <div class="row">
        <div class="col-lg-6 col-md-7 col-sm-8">
          <div class="form-group">
            <label for="forgot-password-username">${uiLabelMap.ExampleEmailAddress}</label>
            <input type="email" name="USERNAME" class="required form-control" id="forgot-password-username" data-label="${uiLabelMap.ExampleEmailAddress}" value="<#if requestParameters.userName?has_content>${requestParameters.userName}<#elseif autoUserLogin?has_content>${autoUserLogin.userLoginId}</#if>"/>
          </div>
          <button type="submit" name="EMAIL_PASSWORD" value="Y" class="btn btn-default">${uiLabelMap.CommonEmailPassword}</button>
        </div>
      </div>
    </form>
  </div>
</div>
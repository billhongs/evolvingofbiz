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

<form method="post" action="<@ofbizUrl>createExample</@ofbizUrl>" class="requireValidation">
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="exampleName">${uiLabelMap.CommonName}</label>
      <input type="text" name="exampleName" class="required form-control" id="exampleName" tabindex="1" autofocus
          data-label="${uiLabelMap.CommonName}" value="${parameters.exampleName?if_exists}"/>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="description">${uiLabelMap.CommonDescription}</label>
      <input type="text" name="description" class="form-control" id="description" tabindex="2" value="${parameters.description?if_exists}"/>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="exampleTypeId">${uiLabelMap.CommonType}</label>
      <select name="exampleTypeId" id="exampleTypeId" class="form-control">
        <#list exampleTypes as exampleType>
          <option value="${(exampleType.exampleTypeId)!}" <#if (parameters.exampleTypeId)!"" == exampleType.exampleTypeId>selected</#if>>${(exampleType.description)!(exampleType.exampleTypeId)}</option>
        </#list>
      </select>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="statusId">${uiLabelMap.CommonStatus}</label>
      <select name="statusId" id="statusId" class="form-control">
        <#list statusItems as statusItem>
          <option value="${(statusItem.statusId)!}" <#if (parameters.statusId)!"" == statusItem.statusId>selected</#if>>${(statusItem.description)!(statusItem.statusId)}</option>
        </#list>
      </select>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="exampleDate">${uiLabelMap.CommonDate}</label>
      <div class="row">
        <div class="col-lg-12 col-md-12">
          <@htmlTemplate.renderDateTimeField name="exampleDate" event="" action="" className="form-control" alert="" title="Format: yyyy-MM-dd HH:mm:ss.SSS" value="${parameters.exampleDate?if_exists}" size="16" maxlength="30" id="exampleDate" dateType="date" shortDateInput=false timeDropdownParamName="" defaultDateTimeString="" localizedIconTitle="" timeDropdown="" timeHourName="" classString="" hour1="" hour2="" timeMinutesName="" minutes="" isTwelveHour="" ampmName="" amSelected="" pmSelected="" compositeType="" formName=""/>
        </div>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <label for="exampleSize">${uiLabelMap.CommonSize}</label>
      <input type="text" name="exampleSize" class="form-control" id="exampleSize" tabindex="5" value="${parameters.exampleSize?if_exists}"/>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-lg-3 col-md-3">
      <button type="submit" class="btn btn-primary relative" tabindex="4">
        ${uiLabelMap.CommonCreate}
        <span class="ajax-loader abs" style="display:none"></span>
      </button>
    </div>
  </div>
</form>